package br.com.ufal.gradua.dtos.institutional;


import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MatrixRequestDTO(
    @NotBlank String curriculumName,
    @NotBlank String subjectCode,
    @NotBlank String subjectType,
    @NotBlank Integer idealSemester
) {}
