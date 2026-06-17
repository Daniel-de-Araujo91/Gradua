package br.com.ufal.gradua.controllers;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.ufal.gradua.dtos.agenda.AgendaDiaDTO;
import br.com.ufal.gradua.dtos.agenda.ReminderRequestDTO;
import br.com.ufal.gradua.dtos.agenda.ReminderResponseDTO;
import br.com.ufal.gradua.services.AgendaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/agenda")
@RequiredArgsConstructor
public class AgendaController {

    private final AgendaService agendaService;

    @GetMapping("/dia/{date}")
    public ResponseEntity<AgendaDiaDTO> getAgendaDoDia(@PathVariable LocalDate date) {
        return ResponseEntity.ok(agendaService.getAgendaDoDia(date));
    }

    @PostMapping("/lembrete")
    public ResponseEntity<ReminderResponseDTO> createReminder(@RequestBody @Valid ReminderRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(agendaService.createReminder(dto));
    }

    @DeleteMapping("/lembrete/{reminderId}")
    public ResponseEntity<Void> deleteReminder(@PathVariable UUID reminderId) {
        agendaService.deleteReminder(reminderId);
        return ResponseEntity.noContent().build();
    }
}