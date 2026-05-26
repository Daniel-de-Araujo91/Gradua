package br.com.ufal.gradua.dtos.forum;

import java.time.LocalDateTime;
import java.util.UUID;

public record ForumTopicResponseDTO(
    UUID id, 
    String title, 
    String content,
    String authorName,
    String type,
    LocalDateTime creationDate
){}
