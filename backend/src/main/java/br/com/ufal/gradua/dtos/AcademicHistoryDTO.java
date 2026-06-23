package br.com.ufal.gradua.dtos;

import java.math.BigDecimal;
import java.util.UUID;

public record AcademicHistoryDTO(
    UUID subjectId,
    String subjectCode,
    String subjectName,
    String academicTerm,
    BigDecimal finalGrade,
    String status,
    Integer creditHours,
    String professorName,
    Integer frequency,
    String subjectType
) {}
