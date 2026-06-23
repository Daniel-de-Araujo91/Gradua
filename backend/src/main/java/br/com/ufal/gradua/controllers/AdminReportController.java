package br.com.ufal.gradua.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import br.com.ufal.gradua.models.forum.ForumTopicModel;
import br.com.ufal.gradua.repositories.ForumCommentRepository;
import br.com.ufal.gradua.repositories.ForumReportRepository;
import br.com.ufal.gradua.repositories.ForumTopicRepository;
import br.com.ufal.gradua.repositories.ForumVoteRepository;

@RestController
@RequestMapping("/admin/reports")
public class AdminReportController {

    @Autowired
    private ForumTopicRepository topicRepository;

    @Autowired
    private ForumCommentRepository commentRepository;

    @Autowired
    private ForumReportRepository reportRepository;

    @Autowired
    private ForumVoteRepository voteRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<Map<String, Object>>> listHiddenTopics() {
        List<ForumTopicModel> hiddenTopics = topicRepository.findByHiddenTrueOrderByCreationDateDesc();
        List<Map<String, Object>> result = new ArrayList<>();

        for (ForumTopicModel topic : hiddenTopics) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("topicId", topic.getTopicId());
            entry.put("title", topic.getTitle());
            entry.put("content", topic.getContent());
            entry.put("authorName", topic.getAuthor().getFirstName() + " " + topic.getAuthor().getLastName());
            entry.put("authorId", topic.getAuthor().getUserId());
            entry.put("type", topic.getType());
            entry.put("creationDate", topic.getCreationDate());
            entry.put("voteScore", topic.getVoteScore());
            entry.put("downVoteCount", topic.getDownVoteCount());
            entry.put("reportCount", topic.getReportCount());
            entry.put("commentCount", topic.getCommentCount());

            List<Map<String, String>> reports = new ArrayList<>();
            for (var report : reportRepository.findByTopic(topic)) {
                Map<String, String> r = new HashMap<>();
                r.put("reason", report.getReason());
                r.put("authorName", report.getAuthor().getFirstName() + " " + report.getAuthor().getLastName());
                reports.add(r);
            }
            entry.put("reports", reports);

            result.add(entry);
        }

        return ResponseEntity.ok(result);
    }

    @PostMapping("/{topicId}/approve")
    @Transactional
    public ResponseEntity<Map<String, Object>> approveTopic(@PathVariable UUID topicId) {
        ForumTopicModel topic = topicRepository.findById(topicId)
            .orElseThrow(() -> new RuntimeException("Tópico não encontrado"));

        topic.setHidden(false);
        topicRepository.save(topic);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Tópico aprovado e restaurado ao fórum");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{topicId}/deny")
    @Transactional
    public ResponseEntity<Map<String, Object>> denyTopic(@PathVariable UUID topicId) {
        ForumTopicModel topic = topicRepository.findById(topicId)
            .orElseThrow(() -> new RuntimeException("Tópico não encontrado"));

        topicRepository.delete(topic);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Tópico e todos os dados relacionados foram removidos");
        return ResponseEntity.ok(response);
    }
}
