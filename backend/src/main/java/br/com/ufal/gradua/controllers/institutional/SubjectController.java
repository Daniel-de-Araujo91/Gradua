package br.com.ufal.gradua.controllers.institutional;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.ufal.gradua.dtos.institutional.SubjectRequestDTO;
import br.com.ufal.gradua.dtos.institutional.SubjectResponseDTO;
import br.com.ufal.gradua.services.institutional.SubjectService;
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
@RequestMapping("/institutional/subject")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    @GetMapping("/list")
    public ResponseEntity<List<SubjectResponseDTO>> listaAll() {
        return ResponseEntity.ok(subjectService.listAll());
    }

    @PostMapping("/create")
    public ResponseEntity<SubjectResponseDTO>  create(@RequestBody @Valid SubjectRequestDTO dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(subjectService.create(dto));
    }
    
    @PutMapping("/edit/{id}")
    public ResponseEntity<SubjectResponseDTO> edit(@PathVariable UUID id, @RequestBody @Valid SubjectRequestDTO dto){
        return ResponseEntity.ok(subjectService.update(id, dto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id){
        subjectService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
