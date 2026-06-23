package br.com.ufal.gradua.dtos.forum;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO de resposta para comentários do fórum.
 * Inclui flag isEdited para exibição do indicador "editado" na interface.
 * Inclui contadores de votos e denúncias para auto-exclusão (spec).
 */
public record ForumCommentResponseDTO(
    UUID commentId,
    String content,
    String authorName,
    UUID authorId,
    LocalDateTime creationDate,
    Boolean isEdited,
    LocalDateTime updatedAt,
    Integer voteScore,
    Integer upVoteCount,
    Integer downVoteCount,
    Integer reportCount,
    String currentUserVote
) {}
