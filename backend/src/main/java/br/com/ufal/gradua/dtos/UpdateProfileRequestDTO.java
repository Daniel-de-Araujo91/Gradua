package br.com.ufal.gradua.dtos;

import jakarta.validation.constraints.Email;

public record UpdateProfileRequestDTO(
    @Email String email,
    String currentPassword,
    String newPassword
) {
}
