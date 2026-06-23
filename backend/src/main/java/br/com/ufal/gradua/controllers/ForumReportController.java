package br.com.ufal.gradua.controllers;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.ufal.gradua.services.ForumCommentService;
import br.com.ufal.gradua.services.ForumTopicService;

@RestController
@RequestMapping("/api/forum/report")
public class ForumReportController {

    @Autowired
    private ForumTopicService forumTopicService;

    @Autowired
    private ForumCommentService forumCommentService;

    @PostMapping("/topic/{topicId}")
    public ResponseEntity<Map<String, Object>> reportTopic(
            @PathVariable UUID topicId,
            @RequestBody String reason) {
            
        forumTopicService.report(topicId, reason);
        
        boolean deleted = !forumTopicService.existsById(topicId);
        Map<String, Object> response = new HashMap<>();
        response.put("deleted", deleted);
        response.put("id", topicId);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/comment/{commentId}")
    public ResponseEntity<Map<String, Object>> reportComment(
            @PathVariable UUID commentId,
            @RequestBody String reason) {
        
        forumCommentService.report(commentId, reason);
        
        boolean deleted = !forumCommentService.existsById(commentId);
        Map<String, Object> response = new HashMap<>();
        response.put("deleted", deleted);
        response.put("id", commentId);
        return ResponseEntity.ok(response);
    }
}