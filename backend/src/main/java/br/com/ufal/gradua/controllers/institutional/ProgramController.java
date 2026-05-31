package br.com.ufal.gradua.controllers.institutional;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.ufal.gradua.dtos.institutional.ProgramRequestDTO;
import br.com.ufal.gradua.dtos.institutional.ProgramResponseDTO;
import br.com.ufal.gradua.services.institutional.ProgramService;
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
@RequestMapping("/institutional/program")
@RequiredArgsConstructor
public class ProgramController {

    private final ProgramService programService;

    @GetMapping("/list")
    public ResponseEntity<List<ProgramResponseDTO>> listaAll() {
        return ResponseEntity.ok(programService.listAll());
    }

    @PostMapping("/create")
    public ResponseEntity<ProgramResponseDTO>  create(@RequestBody @Valid ProgramRequestDTO dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(programService.create(dto));
    }
    
    @PutMapping("/edit/{id}")
    public ResponseEntity<ProgramResponseDTO> edit(@PathVariable UUID id, @RequestBody @Valid ProgramRequestDTO dto){
        return ResponseEntity.ok(programService.update(id, dto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id){
        programService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
