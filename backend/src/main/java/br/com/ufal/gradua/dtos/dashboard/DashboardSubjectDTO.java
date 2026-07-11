package br.com.ufal.gradua.dtos.dashboard;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import br.com.ufal.gradua.dtos.grade.ApprovalForecastDTO;
import br.com.ufal.gradua.models.academic.AbsencesDTO;

public record DashboardSubjectDTO(
    UUID id,
    String code,
    String name,
    String schedule,
    String location,
    String type,
    String professor,
    Integer participants,
    List<String> monitors,
    Map<String, BigDecimal> grades,
    AbsencesDTO absences,
    String deliveryRate,
    ApprovalForecastDTO approvalForecast
) {}
