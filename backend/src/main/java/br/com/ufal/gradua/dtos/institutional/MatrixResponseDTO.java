package br.com.ufal.gradua.dtos.institutional;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;

public record MatrixResponseDTO(
   UUID gridId,
   String curriculumName,
   String subjectCode,
   String subjectType,
   Integer idealSemester
){}
