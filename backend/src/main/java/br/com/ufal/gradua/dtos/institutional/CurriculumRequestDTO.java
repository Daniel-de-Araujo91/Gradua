package br.com.ufal.gradua.dtos.institutional;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CurriculumRequestDTO(
    @NotBlank String programName,
    @NotBlank String effectiveYear,
    @NotBlank String name,
    @NotNull Integer reqMandatoryHours,
    @NotNull Integer reqElectiveHours,
    @NotNull Integer reqComplementaryHours,
    @NotNull Integer reqTotalHours
) {}
