package br.com.ufal.gradua.dtos.dashboard;

/**
 * DTO simples para estatísticas exibidas na home.
 * Valores são gerados a partir do banco (ou estimados) pelo DashboardService.
 */
public record DashboardStatsDTO(
    Double ira,
    Integer integralizationPercent,
    Integer hoursPending
) {}
