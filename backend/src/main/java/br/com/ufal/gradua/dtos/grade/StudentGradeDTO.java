package br.com.ufal.gradua.dtos.grade;

import java.math.BigDecimal;
import java.util.UUID;

public record StudentGradeDTO(
    UUID enrollmentId,
    UUID studentId,
    String studentName,
    String enrollmentNumber,
    BigDecimal ab1,
    BigDecimal ab2,
    BigDecimal reav,
    BigDecimal finalGrade
) {}
