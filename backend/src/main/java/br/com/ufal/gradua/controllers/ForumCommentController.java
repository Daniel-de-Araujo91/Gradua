package br.com.ufal.gradua.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.ufal.gradua.dtos.forum.ForumCommentRequestDTO;
import br.com.ufal.gradua.dtos.forum.ForumCommentResponseDTO;
import br.com.ufal.gradua.services.ForumCommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/forum/comment")
@RequiredArgsConstructor
public class ForumCommentController {

    private final ForumCommentService forumCommentService;

    /** Lista comentários de um tópico, ordenados cronologicamente. */
    @GetMapping("/topic/{topicId}")
    public ResponseEntity<List<ForumCommentResponseDTO>> listByTopic(@PathVariable UUID topicId) {
        return ResponseEntity.ok(forumCommentService.listByTopic(topicId));
    }

    /** Cria comentário em um tópico. */
    @PostMapping("/topic/{topicId}")
    public ResponseEntity<ForumCommentResponseDTO> create(
            @PathVariable UUID topicId,
            @RequestBody @Valid ForumCommentRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(forumCommentService.create(topicId, dto));
    }

    /**
     * Edita um comentário (apenas o autor).
     * Valida autoria e ativa flag isEdited (spec 2.2 e 4.3).
     */
    @PutMapping("/{commentId}")
    public ResponseEntity<ForumCommentResponseDTO> update(
            @PathVariable UUID commentId,
            @RequestBody @Valid ForumCommentRequestDTO dto) {
        return ResponseEntity.ok(forumCommentService.update(commentId, dto));
    }

    /** Remove um comentário (apenas o autor). */
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> delete(@PathVariable UUID commentId) {
        forumCommentService.delete(commentId);
        return ResponseEntity.noContent().build();
    }
}
