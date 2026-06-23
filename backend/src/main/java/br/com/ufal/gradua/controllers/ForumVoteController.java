package br.com.ufal.gradua.controllers;

import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.ufal.gradua.services.ForumVoteService;
import br.com.ufal.gradua.services.ForumTopicService; // <-- Import adicionado
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/forum/vote")
@RequiredArgsConstructor
public class ForumVoteController {

    private final ForumVoteService forumVoteService;
    private final ForumTopicService forumTopicService; 

    @PostMapping("/topic/{topicId}")
    public ResponseEntity<Map<String, Object>> voteTopic(
            @PathVariable UUID topicId,
            @RequestParam String type) {
        Map<String, Object> result = new java.util.HashMap<>(forumVoteService.voteTopic(topicId, type));
        
        boolean deleted = !forumTopicService.existsById(topicId); 
        result.put("id", topicId);
        result.put("deleted", deleted); 
        return ResponseEntity.ok(result);
    }

    @PostMapping("/comment/{commentId}")
    public ResponseEntity<Map<String, Object>> voteComment(
            @PathVariable UUID commentId,
            @RequestParam String type) {
        return ResponseEntity.ok(new java.util.HashMap<>(forumVoteService.voteComment(commentId, type)));
    }

    @GetMapping("/topic/{topicId}")
    public ResponseEntity<Map<String, Object>> getTopicVoteState(@PathVariable UUID topicId) {
        return ResponseEntity.ok(forumVoteService.getVoteState(topicId));
    }

    @GetMapping("/comment/{commentId}")
    public ResponseEntity<Map<String, Object>> getCommentVoteState(@PathVariable UUID commentId) {
        return ResponseEntity.ok(forumVoteService.getCommentVoteState(commentId));
    }
}