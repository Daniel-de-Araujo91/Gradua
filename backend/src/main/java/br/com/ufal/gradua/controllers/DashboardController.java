package br.com.ufal.gradua.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.ufal.gradua.dtos.dashboard.DashboardStatsDTO;
import br.com.ufal.gradua.dtos.dashboard.DashboardSubjectDTO;
import br.com.ufal.gradua.services.DashboardService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> stats() {
        return ResponseEntity.ok(dashboardService.getStatsForCurrentUser());
    }

    @GetMapping("/subjects")
    public ResponseEntity<List<DashboardSubjectDTO>> subjects() {
        return ResponseEntity.ok(dashboardService.getSubjectsForCurrentUser());
    }

    @GetMapping("/announcements")
    public ResponseEntity<List<Object>> announcements() {
        // proxy to forum feed for "aviso"
        return ResponseEntity.ok(dashboardService.getAnnouncements());
    }

    @GetMapping("/agenda/{date}")
    public ResponseEntity<List<Object>> agendaToday(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(dashboardService.getAgenda(date));
    }

    @GetMapping("/profile")
    public ResponseEntity<Object> profile() {
        return ResponseEntity.ok(dashboardService.getProfileForCurrentUser());
    }
}
