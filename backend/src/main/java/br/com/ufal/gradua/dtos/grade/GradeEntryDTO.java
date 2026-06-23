package br.com.ufal.gradua.dtos.grade;

import java.math.BigDecimal;
import java.util.UUID;

public record GradeEntryDTO(
    UUID enrollmentId,
    String gradeType,
    BigDecimal value
) {}
