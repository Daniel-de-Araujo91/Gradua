package br.com.ufal.gradua.dtos;

import jakarta.validation.constraints.NotBlank;

public record RegisterRequestDTO(@NotBlank String firstName,
    @NotBlank String lastName,
    @NotBlank String email,
    @NotBlank String password,
    Boolean isForeigner,
    @NotBlank String document) {

}

    