package br.com.ufal.gradua.dtos;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(
    @NotBlank String document,
    @NotBlank String password
) {}