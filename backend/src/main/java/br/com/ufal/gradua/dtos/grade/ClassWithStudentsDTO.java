package br.com.ufal.gradua.dtos.grade;

import java.util.List;
import java.util.UUID;

public record ClassWithStudentsDTO(
    UUID classId,
    String subjectCode,
    String subjectName,
    String academicTerm,
    String schedule,
    List<StudentGradeDTO> students
) {}
