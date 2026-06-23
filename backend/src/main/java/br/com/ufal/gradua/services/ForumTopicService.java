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

import br.com.ufal.gradua.dtos.forum.ForumTopicRequestDTO;
import br.com.ufal.gradua.dtos.forum.ForumTopicResponseDTO;
import br.com.ufal.gradua.models.forum.ForumTopicModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.ForumTopicRepository;

@Service
@Transactional
public class ForumTopicService {

    @Autowired
    ForumTopicRepository repository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ForumVoteService forumVoteService;

    @Autowired
    private ForumReportService forumReportService;

    private UserModel getUserByToken() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserModel) authentication.getPrincipal();
    }

    private ForumTopicResponseDTO toDTO(ForumTopicModel topic) {
        return new ForumTopicResponseDTO(
            topic.getTopicId(),
            topic.getTitle(),
            topic.getContent(),
            topic.getAuthor().getFirstName() + " " + topic.getAuthor().getLastName(),
            topic.getAuthor().getUserId(),
            topic.getType(),
            topic.getCreationDate(),
            topic.getIsEdited() != null ? topic.getIsEdited() : false,
            topic.getVoteScore() != null ? topic.getVoteScore() : 0,
            topic.getCommentCount() != null ? topic.getCommentCount() : 0,
            topic.getReportCount() != null ? topic.getReportCount() : 0
        );
    }

    public ForumTopicResponseDTO create(ForumTopicRequestDTO dto) {
        UserModel author = getUserByToken();

        if ("AVISO".equalsIgnoreCase(dto.type()) && 
            !("MONITOR".equalsIgnoreCase(author.getRole()) || "ADMIN".equalsIgnoreCase(author.getRole()) || "PROFESSOR".equalsIgnoreCase(author.getRole()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "Apenas monitores, professores ou administradores podem publicar avisos.");
        }

        ForumTopicModel forumTopic = new ForumTopicModel();
        forumTopic.setTitle(dto.title());
        forumTopic.setContent(dto.content());
        forumTopic.setType(dto.type() != null ? dto.type().toUpperCase() : null);
        forumTopic.setAuthor(author);
        forumTopic.setIsLockedByMod(false);
        forumTopic.setIsEdited(false);
        forumTopic.setVoteScore(0);
        forumTopic.setCommentCount(0);
        forumTopic.setCreationDate(LocalDateTime.now(ZoneOffset.of("-3")));

        repository.save(forumTopic);

        if ("aviso".equalsIgnoreCase(dto.type())) {
            String authorName = author.getFirstName() + " " + author.getLastName();
            String message = String.format("📢 Novo aviso de %s: \"%s\"",
                authorName, dto.title());
            notificationService.broadcastAvisoNotification(author.getUserId(), message);
        }

        return toDTO(forumTopic);
    }

    public List<ForumTopicResponseDTO> listAll(String type) {
        List<ForumTopicModel> topics;
        if (type != null && !type.isBlank()) {
            String t = type.toLowerCase();
            if ("pergunta".equals(t) || "duvida".equals(t) || "duvida".equalsIgnoreCase(t)) {
                topics = repository.findByTypeInOrderByCreationDateDesc(java.util.List.of("PERGUNTA", "DUVIDA"));
            } else {
                topics = repository.findByTypeOrderByCreationDateDesc(type.toUpperCase());
            }
        } else {
            topics = repository.findAllByOrderByCreationDateDesc();
        }

        return topics.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ForumTopicResponseDTO update(UUID id, ForumTopicRequestDTO dto) {
        ForumTopicModel forumTopic = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tópico não encontrado"));

        UserModel user = getUserByToken();

        if (!forumTopic.getAuthor().getUserId().equals(user.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas o autor pode editar este tópico");
        }

        forumTopic.setTitle(dto.title());
        forumTopic.setContent(dto.content());
        forumTopic.setType(dto.type());
        forumTopic.setIsEdited(true);

        repository.save(forumTopic);

        return toDTO(forumTopic);
    }

    public void delete(UUID id) {
        ForumTopicModel forumTopic = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tópico não encontrado"));

        UserModel user = getUserByToken();

        boolean isAuthor = forumTopic.getAuthor().getUserId().equals(user.getUserId());
        boolean isModerator = "ADMIN".equalsIgnoreCase(user.getRole())
            || "PROFESSOR".equalsIgnoreCase(user.getRole());

        if (!isAuthor && !isModerator) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Sem permissão para excluir este tópico");
        }

        repository.delete(forumTopic);
    }

    public Map<String, Object> vote(UUID topicId, String voteType) {
        return forumVoteService.voteTopic(topicId, voteType);
    }

    public Map<String, Object> getVoteState(UUID topicId) {
        return forumVoteService.getVoteState(topicId);
    }

    public void report(UUID topicId, String reason) {
        forumReportService.reportTopic(topicId, reason);
    }

    public boolean existsById(UUID id) {
        return repository.existsById(id);
    }

    @Transactional
    public void checkAndDeleteTopic(ForumTopicModel topic) {
        if (topic.getDownVoteCount() >= 5 || topic.getReportCount() >= 3) {
            repository.delete(topic); 
        }
    }
} 