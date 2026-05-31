package br.com.ufal.gradua.dtos.auth;

import java.util.List;

public record ErrorResponseDTO(String message, List<String> errors) {

    public ErrorResponseDTO(String message) {
        this(message, null);
    }
}
