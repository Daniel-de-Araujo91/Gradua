package br.com.ufal.gradua.controllers;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.ufal.gradua.dtos.grade.ClassWithStudentsDTO;
import br.com.ufal.gradua.dtos.grade.GradeEntryDTO;
import br.com.ufal.gradua.services.GradeService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/grades")
@RequiredArgsConstructor
public class GradeController {

    private final GradeService gradeService;

    @GetMapping("/professor/classes")
    public ResponseEntity<List<ClassWithStudentsDTO>> getProfessorClasses() {
        return ResponseEntity.ok(gradeService.getProfessorClassesWithStudents());
    }

    @PostMapping("/save/{classId}")
    public ResponseEntity<Void> saveGrades(@PathVariable UUID classId, @RequestBody List<GradeEntryDTO> grades) {
        gradeService.saveGrades(classId, grades);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/enrollment/{enrollmentId}")
    public ResponseEntity<Map<String, java.math.BigDecimal>> getEnrollmentGrades(
            @PathVariable UUID enrollmentId) {
        return ResponseEntity.ok(gradeService.getGradesForEnrollment(enrollmentId));
    }
}
