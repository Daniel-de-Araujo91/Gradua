package br.com.ufal.gradua.dtos.agenda;

import java.util.List;

public record AgendaDiaDTO(
        List<AgendaClassDTO> classes,
        List<MonitorSessionResponseDTO> monitorSessions,
        List<ReminderResponseDTO> reminders 
) {}