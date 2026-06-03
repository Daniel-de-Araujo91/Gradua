package br.com.ufal.gradua.dtos.agenda;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO de resposta para notificações acadêmicas do aluno (spec 4.3).
 */
public record NotificationResponseDTO(
    UUID notificationId,
    String message,
    Boolean isRead,
    LocalDateTime createdAt,
    MonitorSessionResponseDTO session
) {}
