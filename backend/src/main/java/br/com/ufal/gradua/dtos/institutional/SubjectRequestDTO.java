package br.com.ufal.gradua.dtos.institutional;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SubjectRequestDTO(
    @NotBlank String code,
    @NotBlank String name,
    @NotNull Integer creditHours
) {}
