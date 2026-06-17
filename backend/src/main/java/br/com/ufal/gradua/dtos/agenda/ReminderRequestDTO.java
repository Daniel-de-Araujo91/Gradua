package br.com.ufal.gradua.dtos.agenda;

import java.time.LocalDate;
import java.time.LocalTime;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ReminderRequestDTO(
        @NotBlank String title,
        @NotNull LocalDate date,
        @NotNull LocalTime time,
        String location
) {}