package br.com.ufal.gradua.dtos.agenda;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

/**
 * DTO de resposta de sessão de monitoria.
 */
public record MonitorSessionResponseDTO(
    UUID sessionId,
    String topic,
    LocalDate date,
    LocalTime startTime,
    LocalTime endTime,
    String location,
    String meetingLink,
    String monitorName,
    String subjectName,
    String classSectionId
) {}
