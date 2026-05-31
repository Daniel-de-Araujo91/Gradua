package br.com.ufal.gradua.dtos.forum;

import java.time.LocalDateTime;
import java.util.UUID;

public record ForumCommentResponseDTO(
    UUID commentId,
    UUID topicId, 
    String content,
    String authorName,
    LocalDateTime creationDate
){}
