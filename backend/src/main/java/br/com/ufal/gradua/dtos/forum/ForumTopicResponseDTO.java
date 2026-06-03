package br.com.ufal.gradua.dtos.forum;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO de resposta de tópico do fórum.
 * Inclui flags de edição, contadores de votos/comentários e authorId
 * para que o frontend possa controlar renderização condicional (spec 4.3):
 *   - isEdited: exibir indicador "editado"
 *   - voteScore: ocultar/mostrar componente de votos baseado no tipo
 *   - authorId: determinar se o usuário logado é o autor (para botão de edição)
 */
public record ForumTopicResponseDTO(
    UUID topicId,
    String title,
    String content,
    String authorName,
    UUID authorId,
    String type,
    LocalDateTime creationDate,
    Boolean isEdited,
    Integer voteScore,
    Integer commentCount
) {}
