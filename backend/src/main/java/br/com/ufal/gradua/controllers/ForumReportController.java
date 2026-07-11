package br.com.ufal.gradua.controllers;

import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.ufal.gradua.services.ForumCommentService;
import br.com.ufal.gradua.services.ForumTopicService;

@RestController
@RequestMapping("/api/forum/report")
@RequiredArgsConstructor
public class ForumReportController {

    private final ForumTopicService forumTopicService;

    private final ForumCommentService forumCommentService;

    @PostMapping("/topic/{topicId}")
    public ResponseEntity<Map<String, Object>> reportTopic(
            @PathVariable UUID topicId,
            @RequestBody String reason) {
            
        forumTopicService.report(topicId, reason);
        
        boolean hidden = forumTopicService.isHidden(topicId);
        Map<String, Object> response = new HashMap<>();
        response.put("hidden", hidden);
        response.put("id", topicId);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/comment/{commentId}")
    public ResponseEntity<Map<String, Object>> reportComment(
            @PathVariable UUID commentId,
            @RequestBody String reason) {
        
        forumCommentService.report(commentId, reason);
        
        boolean hidden = forumCommentService.isHidden(commentId);
        Map<String, Object> response = new HashMap<>();
        response.put("hidden", hidden);
        response.put("id", commentId);
        return ResponseEntity.ok(response);
    }
}