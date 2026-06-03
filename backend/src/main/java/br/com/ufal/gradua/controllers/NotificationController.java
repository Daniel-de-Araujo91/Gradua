package br.com.ufal.gradua.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.ufal.gradua.dtos.agenda.NotificationResponseDTO;
import br.com.ufal.gradua.services.NotificationService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /** Lista todas as notificações do usuário logado. */
    @GetMapping
    public ResponseEntity<List<NotificationResponseDTO>> listMyNotifications() {
        return ResponseEntity.ok(notificationService.listMyNotifications());
    }

    /** Retorna contagem de notificações não lidas (badge da Header). */
    @GetMapping("/unread-count")
    public ResponseEntity<Long> unreadCount() {
        return ResponseEntity.ok(notificationService.countUnread());
    }

    /** Marca uma notificação específica como lida. */
    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID id) {
        notificationService.markAsRead(id);
        return ResponseEntity.noContent().build();
    }
}
