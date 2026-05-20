package br.com.ufal.gradua.controllers;

import br.com.ufal.gradua.dtos.ForumTopicRequestDTO;
import br.com.ufal.gradua.dtos.ForumTopicResponseDTO;
import br.com.ufal.gradua.services.ForumTopicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/forum")
@RequiredArgsConstructor
public class ForumTopicController {
    private final ForumTopicService topicService;

    @PostMapping
    public ResponseEntity<ForumTopicResponseDTO> createTopic(@Valid @RequestBody ForumTopicRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(topicService.createTopic(requestDTO));
    }

    @GetMapping
    public ResponseEntity<List<ForumTopicResponseDTO>> getAllTopics() {
        return ResponseEntity.ok(topicService.findAllTopics());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ForumTopicResponseDTO> updateTopic(
            @PathVariable UUID id,
            @Valid @RequestBody ForumTopicRequestDTO requestDTO) {
        return ResponseEntity.ok(topicService.updateTopic(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTopic(@PathVariable UUID id) {
        topicService.deleteTopic(id);
        return ResponseEntity.noContent().build();
    }
}