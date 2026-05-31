package br.com.ufal.gradua.controllers.forum;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.ufal.gradua.dtos.forum.ForumCommentRequestDTO;
import br.com.ufal.gradua.dtos.forum.ForumCommentResponseDTO;
import br.com.ufal.gradua.services.forum.ForumCommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

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
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/forum/comment")
@RequiredArgsConstructor
public class ForumCommentController {

    private final ForumCommentService forumCommentService;

    @GetMapping("/{forumTopicId}")
    public ResponseEntity<List<ForumCommentResponseDTO>> feed(@PathVariable UUID forumTopicId) {
        return ResponseEntity.ok(forumCommentService.listAll(forumTopicId));
    }

    @PostMapping("/create/{forumTopicId}")
    public ResponseEntity<ForumCommentResponseDTO>  create(@RequestBody @Valid ForumCommentRequestDTO dto,@PathVariable UUID forumTopicId){
        return ResponseEntity.status(HttpStatus.CREATED).body(forumCommentService.create(dto, forumTopicId));
    }
    
    @PutMapping("/edit/{id}")
    public ResponseEntity<ForumCommentResponseDTO> edit(@PathVariable UUID id, @RequestBody @Valid ForumCommentRequestDTO dto){
        return ResponseEntity.ok(forumCommentService.update(id, dto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id){
        forumCommentService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
