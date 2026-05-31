package br.com.ufal.gradua.dtos.institutional;

import java.time.LocalDateTime;
import java.util.UUID;

public record SubjectResponseDTO(
    UUID subjectId,
    String code,
    String name,
    Integer creditHours
){}
