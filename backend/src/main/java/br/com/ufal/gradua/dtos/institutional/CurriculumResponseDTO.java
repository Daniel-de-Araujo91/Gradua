package br.com.ufal.gradua.dtos.institutional;

import java.time.LocalDateTime;
import java.util.UUID;

public record CurriculumResponseDTO(
    UUID curriculumId,
    String ProgramName,
    String name,
    String effectiveYear,
    Integer reqMandatoryHours,
    Integer reqElectiveHours,
    Integer reqComplementaryHours,
    Integer reqTotalHours
){}
