package br.com.ufal.gradua.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ForumTopicRequestDTO(
    @NotBlank @Size(min = 5, max = 100) String title,
    @NotBlank @Size(min = 10) String content
) {}
