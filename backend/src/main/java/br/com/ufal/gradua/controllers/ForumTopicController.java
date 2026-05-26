package br.com.ufal.gradua.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.ufal.gradua.services.ForumTopicService;
import br.com.ufal.gradua.dtos.forum.ForumTopicRequestDTO;
import br.com.ufal.gradua.dtos.forum.ForumTopicResponseDTO;
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
@RequestMapping("/forum")
@RequiredArgsConstructor
public class ForumTopicController {

    private final ForumTopicService forumTopicService;

    @GetMapping("/feed")
    public ResponseEntity<List<ForumTopicResponseDTO>> feed(
            @RequestParam(required = false) String type) {
        return ResponseEntity.ok(forumTopicService.listAll(type));
    }

    @PostMapping("/create")
    public ResponseEntity<ForumTopicResponseDTO>  create(@RequestBody @Valid ForumTopicRequestDTO dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(forumTopicService.create(dto));
    }
    
    @PutMapping("/edit/{id}")
    public ResponseEntity<ForumTopicResponseDTO> edit(@PathVariable UUID id, @RequestBody @Valid ForumTopicRequestDTO dto){
        return ResponseEntity.ok(forumTopicService.update(id, dto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id){
        forumTopicService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
