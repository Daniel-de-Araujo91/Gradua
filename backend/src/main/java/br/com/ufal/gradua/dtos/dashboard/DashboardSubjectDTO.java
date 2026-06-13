package br.com.ufal.gradua.dtos.dashboard;

import java.util.List;
import java.util.UUID;

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
    Object grades,
    Object absences,
    String deliveryRate
) {}
