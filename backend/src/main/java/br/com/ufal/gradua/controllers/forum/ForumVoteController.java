package br.com.ufal.gradua.controllers.forum;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.ufal.gradua.dtos.forum.ForumVoteRequestDTO;
import br.com.ufal.gradua.dtos.forum.ForumVoteResponseDTO;
import br.com.ufal.gradua.services.forum.ForumVoteService;
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
@RequestMapping("/forum/vote")
@RequiredArgsConstructor
public class ForumVoteController {

    private final ForumVoteService forumVoteService;

    @GetMapping("/cont/{forumTopicId}")
    public ResponseEntity<Integer> feed(@PathVariable UUID forumTopicId, @RequestBody @Valid ForumVoteRequestDTO dto) {
        return ResponseEntity.ok(forumVoteService.cont(forumTopicId, dto));
    }

    @PostMapping("/create/{forumTopicId}")
    public ResponseEntity<ForumVoteResponseDTO>  create(@RequestBody @Valid ForumVoteRequestDTO dto,@PathVariable UUID forumTopicId){
        return ResponseEntity.status(HttpStatus.CREATED).body(forumVoteService.create(dto, forumTopicId));
    }
    

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id){
        forumVoteService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
