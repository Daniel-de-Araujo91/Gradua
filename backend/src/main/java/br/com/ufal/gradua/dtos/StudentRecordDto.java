package br.com.ufal.gradua.dtos;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record StudentRecordDto(@NotBlank String firstName,
                               @NotBlank String lastName,
                               @NotBlank String email,
                               @NotBlank String passwordHash,
                               @NotNull boolean isForeigner,
                               @Nullable String cpf,
                               @Nullable String passport,
                               @NotBlank String registration,
                               @NotNull BigDecimal ira,
                               @NotNull int integratedHours,
                               @NotBlank String course ) {
}
