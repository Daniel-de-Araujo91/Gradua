package br.com.ufal.gradua.controllers.institutional;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.ufal.gradua.dtos.institutional.CurriculumRequestDTO;
import br.com.ufal.gradua.dtos.institutional.CurriculumResponseDTO;
import br.com.ufal.gradua.services.institutional.CurriculumService;
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
@RequestMapping("/institutional/curriculum")
@RequiredArgsConstructor
public class CurriculumController {

    private final CurriculumService curriculumService;

    @GetMapping("/list")
    public ResponseEntity<List<CurriculumResponseDTO>> listaAll() {
        return ResponseEntity.ok(curriculumService.listAll());
    }

    @PostMapping("/create")
    public ResponseEntity<CurriculumResponseDTO>  create(@RequestBody @Valid CurriculumRequestDTO dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(curriculumService.create(dto));
    }
    
    @PutMapping("/edit/{id}")
    public ResponseEntity<CurriculumResponseDTO> edit(@PathVariable UUID id, @RequestBody @Valid CurriculumRequestDTO dto){
        return ResponseEntity.ok(curriculumService.update(id, dto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id){
        curriculumService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
