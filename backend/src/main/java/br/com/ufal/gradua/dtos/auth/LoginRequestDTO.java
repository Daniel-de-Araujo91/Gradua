package br.com.ufal.gradua.dtos.auth;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(@NotBlank String document,@NotBlank String password) {}
