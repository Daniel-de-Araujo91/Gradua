package br.com.ufal.gradua.dtos.agenda;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record ReminderResponseDTO(
        UUID reminderId,
        String title,
        LocalDate date,
        LocalTime time,
        String location
) {}