package br.com.ufal.gradua.dtos;

import java.util.UUID;

public record AnnouncementRequestDTO(
    String title,
    String content,
    UUID classId,
    UUID programId
) {}
