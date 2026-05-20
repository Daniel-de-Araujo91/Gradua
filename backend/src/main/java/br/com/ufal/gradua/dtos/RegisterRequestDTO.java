package br.com.ufal.gradua.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegisterRequestDTO(
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotBlank @Email String email,
        @NotBlank String password,
        @NotNull Boolean isForeigner,
        @NotBlank String document, // CPF ou Passaporte
        @NotBlank String role // Deve vir do frontend como "STUDENT" ou "PROFESSOR"
) {}