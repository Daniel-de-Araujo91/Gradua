package br.com.ufal.gradua.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.ufal.gradua.models.academic.AttendanceDTO;
import br.com.ufal.gradua.models.academic.ClassSessionDTO;
import br.com.ufal.gradua.services.ClassSessionService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/classes")
@RequiredArgsConstructor
public class ClassSessionController {

    private final ClassSessionService classSessionService;

    @PostMapping("/{classId}/sessions")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<ClassSessionDTO> createSession(
            @PathVariable UUID classId,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(name = "description", required = false) String description) {
        ClassSessionDTO session = classSessionService.createSession(classId, date, description);
        return ResponseEntity.status(HttpStatus.CREATED).body(session);
    }

    @GetMapping("/{classId}/sessions")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<List<ClassSessionDTO>> getSessions(@PathVariable UUID classId) {
        return ResponseEntity.ok(classSessionService.getSessions(classId));
    }

    @DeleteMapping("/sessions/{sessionId}")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<Void> deleteSession(@PathVariable UUID sessionId) {
        classSessionService.deleteSession(sessionId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/sessions/{sessionId}/attendance")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<List<AttendanceDTO>> getAttendance(@PathVariable UUID sessionId) {
        return ResponseEntity.ok(classSessionService.getAttendanceForSession(sessionId));
    }

    @PostMapping("/sessions/{sessionId}/attendance")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<Void> markAttendance(
            @PathVariable UUID sessionId,
            @RequestBody List<AttendanceDTO> attendanceList) {
        classSessionService.markAttendance(sessionId, attendanceList);
        return ResponseEntity.noContent().build();
    }
}
