package br.com.ufal.gradua.dtos.agenda;

import java.util.UUID;

public record AgendaClassDTO(
        UUID classId,
        String subjectName,
        String subjectCode,
        String schedule,
        String location
) {}