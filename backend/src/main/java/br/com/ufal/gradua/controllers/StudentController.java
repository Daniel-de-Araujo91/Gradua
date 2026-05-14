package br.com.ufal.gradua.controllers;

import br.com.ufal.gradua.dtos.StudentRecordDto;
import br.com.ufal.gradua.models.StudentModel;
import br.com.ufal.gradua.services.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class StudentController {
    @Autowired
    private StudentService studentService;

    @PostMapping("/students")
    public ResponseEntity<StudentModel> saveStudent(@RequestBody @Valid StudentRecordDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studentService.save(dto));
    }

    @GetMapping("/students")
    public ResponseEntity<List<StudentModel>> getAllStudent() {
        return ResponseEntity.status((HttpStatus.OK)).body(studentService.findAll());
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<Object> getStudent(@PathVariable(value = "id") UUID id) {
        if(studentService.getById(id).toString().isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
        }
        return ResponseEntity.status(HttpStatus.OK).body(studentService.getById(id));
    }

    @PutMapping("/students/{id}")
    public ResponseEntity<Object> updateStudent( @PathVariable(value = "id") UUID id,@RequestBody @Valid StudentRecordDto dto) {
        if(studentService.getById(id).toString().isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
        }
        return ResponseEntity.status(HttpStatus.OK).body(studentService.updateStudent(id, dto));
    }

}
