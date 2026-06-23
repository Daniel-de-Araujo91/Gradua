package br.com.ufal.gradua.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.ufal.gradua.dtos.AcademicHistoryDTO;
import br.com.ufal.gradua.services.AcademicHistoryService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/academic-history")
@RequiredArgsConstructor
public class AcademicHistoryController {

    private final AcademicHistoryService academicHistoryService;

    @GetMapping
    public ResponseEntity<List<AcademicHistoryDTO>> getHistory() {
        return ResponseEntity.ok(academicHistoryService.getHistoryForCurrentUser());
    }
}
