package br.com.ufal.gradua.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.com.ufal.gradua.dtos.UpdateProfileRequestDTO;
import br.com.ufal.gradua.dtos.dashboard.DashboardStatsDTO;
import br.com.ufal.gradua.dtos.dashboard.DashboardSubjectDTO;
import br.com.ufal.gradua.services.DashboardService;
import jakarta.validation.Valid;
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

    @PutMapping("/profile")
    public ResponseEntity<Object> updateProfile(@RequestBody @Valid UpdateProfileRequestDTO body) {
        return ResponseEntity.ok(dashboardService.updateProfile(body));
    }

    @PostMapping(value = "/profile/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> uploadProfilePhoto(@RequestParam("photo") MultipartFile file) {
        return ResponseEntity.ok(dashboardService.uploadProfilePhoto(file));
    }
}
