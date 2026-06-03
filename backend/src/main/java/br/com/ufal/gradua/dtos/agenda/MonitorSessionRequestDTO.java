package br.com.ufal.gradua.dtos.agenda;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO de criação de sessão de monitoria (spec 4.2).
 * Todos os campos de horário e data são obrigatórios.
 */
public record MonitorSessionRequestDTO(
    @NotBlank String topic,
    @NotNull LocalDate date,
    @NotNull LocalTime startTime,
    @NotNull LocalTime endTime,
    String location,
    String meetingLink,
    @NotNull UUID classSectionId
) {}
