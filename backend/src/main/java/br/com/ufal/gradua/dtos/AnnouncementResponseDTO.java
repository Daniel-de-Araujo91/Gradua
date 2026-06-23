package br.com.ufal.gradua.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

public record AnnouncementResponseDTO(
    UUID id,
    String title,
    String content,
    String authorName,
    String targetClass,
    UUID classId,
    LocalDateTime publishDate
) {}
