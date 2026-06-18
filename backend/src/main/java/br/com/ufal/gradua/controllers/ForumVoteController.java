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
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/forum/vote")
@RequiredArgsConstructor
public class ForumVoteController {

    private final ForumVoteService forumVoteService;

    @PostMapping("/{topicId}")
    public ResponseEntity<Map<String, Object>> vote(
            @PathVariable UUID topicId,
            @RequestParam String type) {
        return ResponseEntity.ok(forumVoteService.vote(topicId, type));
    }

    @GetMapping("/{topicId}")
    public ResponseEntity<Map<String, Object>> getState(@PathVariable UUID topicId) {
        return ResponseEntity.ok(forumVoteService.getVoteState(topicId));
    }
}
