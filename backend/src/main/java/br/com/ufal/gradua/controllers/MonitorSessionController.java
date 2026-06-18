package br.com.ufal.gradua.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.ufal.gradua.dtos.agenda.MonitorSessionRequestDTO;
import br.com.ufal.gradua.dtos.agenda.MonitorSessionResponseDTO;
import br.com.ufal.gradua.services.MonitorSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/monitoria")
@RequiredArgsConstructor
public class MonitorSessionController {

    private final MonitorSessionService monitorSessionService;

    @PostMapping("/create")
    public ResponseEntity<MonitorSessionResponseDTO> create(@RequestBody @Valid MonitorSessionRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(monitorSessionService.createSession(dto));
    }

    @GetMapping("/minhas-sessoes")
    public ResponseEntity<List<MonitorSessionResponseDTO>> listMySessions() {
        return ResponseEntity.ok(monitorSessionService.listMySessionsAsMonitor());
    }

    @GetMapping("/turma/{classSectionId}")
    public ResponseEntity<List<MonitorSessionResponseDTO>> listByClass(@PathVariable UUID classSectionId) {
        return ResponseEntity.ok(monitorSessionService.listByClassSection(classSectionId));
    }
}
