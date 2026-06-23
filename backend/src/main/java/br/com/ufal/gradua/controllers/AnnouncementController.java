package br.com.ufal.gradua.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.ufal.gradua.dtos.AnnouncementRequestDTO;
import br.com.ufal.gradua.dtos.AnnouncementResponseDTO;
import br.com.ufal.gradua.services.AnnouncementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @PostMapping
    public ResponseEntity<AnnouncementResponseDTO> create(@RequestBody @Valid AnnouncementRequestDTO dto) {
        return ResponseEntity.ok(announcementService.create(dto));
    }

    @GetMapping("/my-classes")
    public ResponseEntity<List<AnnouncementResponseDTO>> listMyClassAnnouncements() {
        return ResponseEntity.ok(announcementService.listMyClassAnnouncements());
    }

    @GetMapping("/student")
    public ResponseEntity<List<AnnouncementResponseDTO>> getAnnouncementsForStudent() {
        return ResponseEntity.ok(announcementService.getAnnouncementsForStudent());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        announcementService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
