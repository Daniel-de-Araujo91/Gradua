package br.com.ufal.gradua.controllers;

import java.util.List;
import java.util.UUID;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.ufal.gradua.dtos.forum.ForumCommentRequestDTO;
import br.com.ufal.gradua.dtos.forum.ForumCommentResponseDTO;
import br.com.ufal.gradua.services.ForumCommentService;
import br.com.ufal.gradua.services.ForumTopicService;
import br.com.ufal.gradua.services.ForumVoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/forum/comment")
@RequiredArgsConstructor
public class ForumCommentController {

    private final ForumVoteService forumVoteService;
    private final ForumTopicService forumTopicService;
    private final ForumCommentService forumCommentService;

    @GetMapping("/topic/{topicId}")
    public ResponseEntity<List<ForumCommentResponseDTO>> listByTopic(@PathVariable UUID topicId) {
        return ResponseEntity.ok(forumCommentService.listByTopic(topicId));
    }

    @PostMapping("/topic/{topicId}")
    public ResponseEntity<ForumCommentResponseDTO> create(
            @PathVariable UUID topicId,
            @RequestBody @Valid ForumCommentRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(forumCommentService.create(topicId, dto));
    }

    
    @PutMapping("/{commentId}")
    public ResponseEntity<ForumCommentResponseDTO> update(
            @PathVariable UUID commentId,
            @RequestBody @Valid ForumCommentRequestDTO dto) {
        return ResponseEntity.ok(forumCommentService.update(commentId, dto));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> delete(@PathVariable UUID commentId) {
        forumCommentService.delete(commentId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/comment/{commentId}")
    public ResponseEntity<Map<String, Object>> voteComment(
            @PathVariable UUID commentId,
            @RequestParam String type) {
            
        Map<String, Object> result = new java.util.HashMap<>(forumVoteService.voteComment(commentId, type));
        
        boolean deleted = !forumCommentService.existsById(commentId);
        result.put("id", commentId);
        result.put("deleted", deleted);
        
        return ResponseEntity.ok(result);
    }
}
