package br.com.ufal.gradua.dtos.forum;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO de criação/edição de comentário em tópico do fórum.
 */
public record ForumCommentRequestDTO(
    @NotBlank String content
) {}
