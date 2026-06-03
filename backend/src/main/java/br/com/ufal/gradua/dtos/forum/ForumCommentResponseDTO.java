package br.com.ufal.gradua.dtos.forum;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO de resposta para comentários do fórum.
 * Inclui flag isEdited para exibição do indicador "editado" na interface.
 */
public record ForumCommentResponseDTO(
    UUID commentId,
    String content,
    String authorName,
    UUID authorId,
    LocalDateTime creationDate,
    Boolean isEdited,
    LocalDateTime updatedAt
) {}
