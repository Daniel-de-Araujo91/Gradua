package br.com.ufal.gradua.controllers.institutional;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.ufal.gradua.dtos.institutional.MatrixRequestDTO;
import br.com.ufal.gradua.dtos.institutional.MatrixResponseDTO;
import br.com.ufal.gradua.services.institutional.MatrixService;
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
@RequestMapping("/institutional/matix")
@RequiredArgsConstructor
public class MatrixController {

    private final MatrixService matrixService;

    @GetMapping("/list")
    public ResponseEntity<List<MatrixResponseDTO>> listaAll() {
        return ResponseEntity.ok(matrixService.listAll());
    }

    @PostMapping("/create")
    public ResponseEntity<MatrixResponseDTO>  create(@RequestBody @Valid MatrixRequestDTO dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(matrixService.create(dto));
    }
    
    @PutMapping("/edit/{id}")
    public ResponseEntity<MatrixResponseDTO> edit(@PathVariable UUID id, @RequestBody @Valid MatrixRequestDTO dto){
        return ResponseEntity.ok(matrixService.update(id, dto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id){
        matrixService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
