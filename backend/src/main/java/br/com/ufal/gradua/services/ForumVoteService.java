package br.com.ufal.gradua.services;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.ufal.gradua.models.forum.ForumTopicModel;
import br.com.ufal.gradua.models.forum.ForumCommentModel;
import br.com.ufal.gradua.models.forum.ForumVoteModel;
import br.com.ufal.gradua.models.forum.ForumVoteModel.VoteType;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.ForumTopicRepository;
import br.com.ufal.gradua.repositories.ForumCommentRepository;
import br.com.ufal.gradua.repositories.ForumVoteRepository;

@Service
@Transactional
public class ForumVoteService {

    @Autowired ForumVoteRepository voteRepository;
    @Autowired ForumTopicRepository topicRepository;
    @Autowired ForumCommentRepository commentRepository;

    private UserModel getCurrentUser() {
        return (UserModel) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public Map<String, Object> voteTopic(UUID topicId, String voteTypeStr) {
        UserModel user = getCurrentUser();
        ForumTopicModel topic = topicRepository.findById(topicId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tópico não encontrado"));

        if ("AVISO".equalsIgnoreCase(topic.getType())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Avisos não permitem votação");
        }

        VoteType incoming = "down".equalsIgnoreCase(voteTypeStr) ? VoteType.DOWN : VoteType.UP;
        Optional<ForumVoteModel> existing = voteRepository.findByTopicAndAuthor(topic, user);

        if (existing.isPresent()) {
            ForumVoteModel vote = existing.get();
            if (vote.getVoteType() == incoming) {
                voteRepository.delete(vote);
            } else {
                vote.setVoteType(incoming);
                voteRepository.save(vote);
            }
        } else {
            ForumVoteModel vote = new ForumVoteModel();
            vote.setTopic(topic);
            vote.setAuthor(user);
            vote.setVoteType(incoming);
            voteRepository.save(vote);
        }

        long ups   = voteRepository.countByTopicAndVoteType(topic, VoteType.UP);
        long downs = voteRepository.countByTopicAndVoteType(topic, VoteType.DOWN);
        topic.setUpVoteCount((int) ups);
        topic.setDownVoteCount((int) downs);
        topic.setVoteScore((int)(ups - downs));
        topicRepository.save(topic);

        if (checkAndAutoDeleteTopic(topic)) {
            return Map.of(
                "hidden", true,
                "ups", ups,
                "downs", downs,
                "voteScore", (long)(ups - downs),
                "currentUserVote", ""
            );
        }

        Optional<ForumVoteModel> current = voteRepository.findByTopicAndAuthor(topic, user);
        String currentVote = current.map(v -> v.getVoteType().name().toLowerCase()).orElse(null);

        return Map.of(
            "ups", ups,
            "downs", downs,
            "voteScore", (long)(ups - downs),
            "currentUserVote", currentVote != null ? currentVote : ""
        );
    }

    public Map<String, Object> voteComment(UUID commentId, String voteTypeStr) {
        UserModel user = getCurrentUser();
        ForumCommentModel comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comentário não encontrado"));

        VoteType incoming = "down".equalsIgnoreCase(voteTypeStr) ? VoteType.DOWN : VoteType.UP;
        Optional<ForumVoteModel> existing = voteRepository.findByCommentAndAuthor(comment, user);

        if (existing.isPresent()) {
            ForumVoteModel vote = existing.get();
            if (vote.getVoteType() == incoming) {
                voteRepository.delete(vote);
            } else {
                vote.setVoteType(incoming);
                voteRepository.save(vote);
            }
        } else {
            ForumVoteModel vote = new ForumVoteModel();
            vote.setComment(comment);
            vote.setAuthor(user);
            vote.setVoteType(incoming);
            voteRepository.save(vote);
        }

        long ups   = voteRepository.countByCommentAndVoteType(comment, VoteType.UP);
        long downs = voteRepository.countByCommentAndVoteType(comment, VoteType.DOWN);
        comment.setUpVoteCount((int) ups);
        comment.setDownVoteCount((int) downs);
        comment.setVoteScore((int)(ups - downs));
        commentRepository.save(comment);

        if (checkAndAutoDeleteComment(comment)) {
            return Map.of(
                "hidden", true,
                "ups", ups,
                "downs", downs,
                "voteScore", (long)(ups - downs),
                "currentUserVote", ""
            );
        }

        Optional<ForumVoteModel> current = voteRepository.findByCommentAndAuthor(comment, user);
        String currentVote = current.map(v -> v.getVoteType().name().toLowerCase()).orElse(null);

        return Map.of(
            "ups", ups,
            "downs", downs,
            "voteScore", (long)(ups - downs),
            "currentUserVote", currentVote != null ? currentVote : ""
        );
    }

    public Map<String, Object> getVoteState(UUID topicId) {
        UserModel user = getCurrentUser();
        ForumTopicModel topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tópico não encontrado"));

        Optional<ForumVoteModel> current = voteRepository.findByTopicAndAuthor(topic, user);
        String currentVote = current.map(v -> v.getVoteType().name().toLowerCase()).orElse(null);

        return Map.of(
                "ups", topic.getUpVoteCount() != null ? topic.getUpVoteCount() : 0,
                "downs", topic.getDownVoteCount() != null ? topic.getDownVoteCount() : 0,
                "voteScore", topic.getVoteScore() != null ? topic.getVoteScore() : 0,
                "currentUserVote", currentVote != null ? currentVote : ""
        );
    }

    public Map<String, Object> getCommentVoteState(UUID commentId) {
        UserModel user = getCurrentUser();
        ForumCommentModel comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comentário não encontrado"));

        Optional<ForumVoteModel> current = voteRepository.findByCommentAndAuthor(comment, user);
        String currentVote = current.map(v -> v.getVoteType().name().toLowerCase()).orElse(null);

        return Map.of(
                "ups", comment.getUpVoteCount() != null ? comment.getUpVoteCount() : 0,
                "downs", comment.getDownVoteCount() != null ? comment.getDownVoteCount() : 0,
                "voteScore", comment.getVoteScore() != null ? comment.getVoteScore() : 0,
                "currentUserVote", currentVote != null ? currentVote : ""
        );
    }

    private boolean checkAndAutoDeleteTopic(ForumTopicModel topic) {
        int downVotes = topic.getDownVoteCount() != null ? topic.getDownVoteCount() : 0;
        int reports = topic.getReportCount() != null ? topic.getReportCount() : 0;

        if (downVotes >= 5 || reports >= 3) {
            topic.setHidden(true);
            topicRepository.save(topic);
            return true;
        }
        return false;
    }

    private boolean checkAndAutoDeleteComment(ForumCommentModel comment) {
        int downVotes = comment.getDownVoteCount() != null ? comment.getDownVoteCount() : 0;
        int reports = comment.getReportCount() != null ? comment.getReportCount() : 0;

        if (downVotes >= 5 || reports >= 3) {
            ForumTopicModel topic = comment.getTopic();
            if (topic != null && topic.getCommentCount() != null && topic.getCommentCount() > 0) {
                topic.setCommentCount(topic.getCommentCount() - 1);
                topicRepository.save(topic);
            }
            comment.setHidden(true);
            commentRepository.save(comment);
            return true;
        }
        return false;
    }
}
