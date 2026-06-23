package br.com.ufal.gradua.services;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.ufal.gradua.dtos.forum.ForumCommentRequestDTO;
import br.com.ufal.gradua.dtos.forum.ForumCommentResponseDTO;
import br.com.ufal.gradua.models.forum.ForumCommentModel;
import br.com.ufal.gradua.models.forum.ForumTopicModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.ForumCommentRepository;
import br.com.ufal.gradua.repositories.ForumTopicRepository;
import br.com.ufal.gradua.repositories.ForumVoteRepository;

@Service
@Transactional
public class ForumCommentService {

    @Autowired
    ForumCommentRepository commentRepository;

    @Autowired
    ForumTopicRepository topicRepository;

    @Autowired
    ForumVoteRepository voteRepository;

    @Autowired
    ForumVoteService forumVoteService;

    @Autowired
    ForumReportService forumReportService;

    private UserModel getUserByToken() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return null;
        }
        return (UserModel) authentication.getPrincipal();
    }

    private ForumCommentResponseDTO toDTO(ForumCommentModel comment) {
        UserModel user = null;
        try {
            user = getUserByToken();
        } catch (Exception e) {
            // Ignorar
        }
        
        String currentUserVote = "";
        if (user != null) {
            var voteOpt = voteRepository.findByCommentAndAuthor(comment, user);
            if (voteOpt.isPresent()) {
                currentUserVote = voteOpt.get().getVoteType().name().toLowerCase();
            }
        }

        return new ForumCommentResponseDTO(
            comment.getCommentId(),
            comment.getContent(),
            comment.getAuthor().getFirstName() + " " + comment.getAuthor().getLastName(),
            comment.getAuthor().getUserId(),
            comment.getCreationDate(),
            comment.getIsEdited() != null ? comment.getIsEdited() : false,
            comment.getUpdatedAt(),
            comment.getVoteScore() != null ? comment.getVoteScore() : 0,
            comment.getUpVoteCount() != null ? comment.getUpVoteCount() : 0,
            comment.getDownVoteCount() != null ? comment.getDownVoteCount() : 0,
            comment.getReportCount() != null ? comment.getReportCount() : 0,
            currentUserVote,
            comment.getHidden() != null && comment.getHidden()
        );
    }

    public List<ForumCommentResponseDTO> listByTopic(UUID topicId) {
        ForumTopicModel topic = topicRepository.findById(topicId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tópico não encontrado"));

        return commentRepository.findByTopicOrderByCreationDateAsc(topic)
            .stream().map(this::toDTO).collect(Collectors.toList());
    }

    private boolean isUserRestricted(UserModel user) {
        if (user.getRedFlagCount() != null && user.getRedFlagCount() >= 4) return true;
        if (user.getRestrictedUntil() == null) return false;
        return user.getRestrictedUntil().isAfter(LocalDateTime.now());
    }

    public ForumCommentResponseDTO create(UUID topicId, ForumCommentRequestDTO dto) {
        UserModel author = getUserByToken();

        if (isUserRestricted(author)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você está suspenso e não pode comentar.");
        }

        ForumTopicModel topic = topicRepository.findById(topicId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tópico não encontrado"));

        ForumCommentModel comment = new ForumCommentModel();
        comment.setTopic(topic);
        comment.setAuthor(author);
        comment.setContent(dto.content());
        comment.setIsEdited(false);
        comment.setCreationDate(LocalDateTime.now(ZoneOffset.of("-3")));

        commentRepository.save(comment);

        topic.setCommentCount((topic.getCommentCount() != null ? topic.getCommentCount() : 0) + 1);
        topicRepository.save(topic);

        return toDTO(comment);
    }

    public ForumCommentResponseDTO update(UUID commentId, ForumCommentRequestDTO dto) {
        ForumCommentModel comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comentário não encontrado"));

        UserModel user = getUserByToken();

        if (!comment.getAuthor().getUserId().equals(user.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas o autor pode editar este comentário");
        }

        comment.setContent(dto.content());
        comment.setIsEdited(true);
        comment.setUpdatedAt(LocalDateTime.now(ZoneOffset.of("-3")));

        commentRepository.save(comment);
        return toDTO(comment);
    }

    public void delete(UUID commentId) {
        ForumCommentModel comment = commentRepository.findWithTopicById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comentário não encontrado"));

        UserModel user = getUserByToken();

        if (!comment.getAuthor().getUserId().equals(user.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas o autor pode excluir este comentário");
        }

        ForumTopicModel topic = comment.getTopic();
        if (topic != null && topic.getCommentCount() != null && topic.getCommentCount() > 0) {
            topic.setCommentCount(topic.getCommentCount() - 1);
            topicRepository.save(topic);
        }

        commentRepository.delete(comment);
    }

    public Map<String, Object> vote(UUID commentId, String voteType) {
        return forumVoteService.voteComment(commentId, voteType);
    }

    public Map<String, Object> getVoteState(UUID commentId) {
        return forumVoteService.getCommentVoteState(commentId);
    }

    public void report(UUID commentId, String reason) {
        forumReportService.reportComment(commentId, reason);
    }

    public boolean existsById(UUID id) {
        return commentRepository.existsById(id);
    }

    public boolean isHidden(UUID id) {
        return commentRepository.findById(id)
            .map(c -> c.getHidden() != null && c.getHidden())
            .orElse(false);
    }

    @Transactional
    public void checkAndDeleteComment(ForumCommentModel comment) {
        if (comment.getDownVoteCount() != null && comment.getDownVoteCount() >= 5 ||
            comment.getReportCount() != null && comment.getReportCount() >= 3) {
            ForumTopicModel topic = comment.getTopic();
            if (topic != null && topic.getCommentCount() != null && topic.getCommentCount() > 0) {
                topic.setCommentCount(topic.getCommentCount() - 1);
                topicRepository.save(topic);
            }
            comment.setHidden(true);
            commentRepository.save(comment);
        }
    }
}