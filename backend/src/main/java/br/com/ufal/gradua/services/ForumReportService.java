package br.com.ufal.gradua.services;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.ufal.gradua.models.forum.ForumReportModel;
import br.com.ufal.gradua.models.forum.ForumTopicModel;
import br.com.ufal.gradua.models.forum.ForumCommentModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.ForumReportRepository;
import br.com.ufal.gradua.repositories.ForumTopicRepository;
import br.com.ufal.gradua.repositories.ForumCommentRepository;

@Service
@Transactional
public class ForumReportService {

    @Autowired
    private ForumReportRepository reportRepository;

    @Autowired
    private ForumTopicRepository topicRepository;

    @Autowired
    private ForumCommentRepository commentRepository;

    private UserModel getCurrentUser() {
        return (UserModel) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public void reportTopic(UUID topicId, String reason) {
        UserModel user = getCurrentUser();
        ForumTopicModel topic = topicRepository.findById(topicId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tópico não encontrado"));

        if (reportRepository.existsByTopicAndAuthor(topic, user)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Você já reportou este tópico");
        }

        ForumReportModel report = new ForumReportModel();
        report.setTopic(topic);
        report.setAuthor(user);
        report.setReason(reason);
        report.setCreationDate(LocalDateTime.now(ZoneOffset.of("-3")));
        report.setReportType(ForumReportModel.ReportType.TOPIC);
        reportRepository.save(report);

        long reportCount = reportRepository.countByTopic(topic);
        topic.setReportCount((int) reportCount);
        topicRepository.save(topic);

        checkAndAutoDeleteTopic(topic);
    }

    public void reportComment(UUID commentId, String reason) {
        UserModel user = getCurrentUser();
        ForumCommentModel comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comentário não encontrado"));

        if (reportRepository.existsByCommentAndAuthor(comment, user)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Você já reportou este comentário");
        }

        ForumReportModel report = new ForumReportModel();
        report.setComment(comment);
        report.setAuthor(user);
        report.setReason(reason);
        report.setCreationDate(LocalDateTime.now(ZoneOffset.of("-3")));
        report.setReportType(ForumReportModel.ReportType.COMMENT);
        reportRepository.save(report);

        long reportCount = reportRepository.countByComment(comment);
        comment.setReportCount((int) reportCount);
        commentRepository.save(comment);

        checkAndAutoDeleteComment(comment);
    }

    private void checkAndAutoDeleteTopic(ForumTopicModel topic) {
        int downVotes = topic.getDownVoteCount() != null ? topic.getDownVoteCount() : 0;
        int reports = topic.getReportCount() != null ? topic.getReportCount() : 0;

        if (downVotes >= 5 || reports >= 3) {
            topicRepository.delete(topic);
        }
    }

    private void checkAndAutoDeleteComment(ForumCommentModel comment) {
        int downVotes = comment.getDownVoteCount() != null ? comment.getDownVoteCount() : 0;
        int reports = comment.getReportCount() != null ? comment.getReportCount() : 0;

        if (downVotes >= 5 || reports >= 3) {
            ForumTopicModel topic = comment.getTopic();
            if (topic != null && topic.getCommentCount() != null && topic.getCommentCount() > 0) {
                topic.setCommentCount(topic.getCommentCount() - 1);
                topicRepository.save(topic);
            }
            commentRepository.delete(comment);
        }
    }
}