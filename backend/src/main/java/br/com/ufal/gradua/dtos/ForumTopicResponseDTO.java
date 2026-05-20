package br.com.ufal.gradua.dtos;

import java.time.LocalDateTime;
import java.util.UUID;



public record ForumTopicResponseDTO(
    UUID topicId,
    UUID authorId,
    String title,
    String content,
    Boolean isLockedByMod,
    LocalDateTime creationDate
) {}
