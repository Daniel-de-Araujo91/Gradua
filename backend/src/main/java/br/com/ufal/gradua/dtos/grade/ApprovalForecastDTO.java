package br.com.ufal.gradua.dtos.grade;

import java.math.BigDecimal;

/**
 * DTO que encapsula a previsão de aprovação calculada pelo GradeService.
 *
 * Possíveis valores de {@code status}:
 * <ul>
 *   <li>NO_GRADES              – Nenhuma nota lançada ainda</li>
 *   <li>NEEDS_SCORE            – Falta AB2; aprovação direta ainda é possível</li>
 *   <li>REEVALUATION_CERTAIN   – Falta AB2; aprovação direta é matematicamente impossível</li>
 *   <li>APPROVED               – Aprovado (direta, pós-REAV ou pós-Final)</li>
 *   <li>NEEDS_REAV             – Ambas ABs lançadas; REAV pode garantir aprovação direta</li>
 *   <li>REAV_MAY_SAVE          – REAV não garante aprovação direta, mas pode dar acesso à Final</li>
 *   <li>NEEDS_FINAL            – Média efetiva entre 5.0 e 6.9; precisa de prova Final</li>
 *   <li>FAILED                 – Reprovado (média < 5.0 ou nota ponderada final < 5.5)</li>
 * </ul>
 *
 * @param status              Identificador do estado (ver lista acima)
 * @param message             Mensagem legível, pronta para exibição direta na UI
 * @param currentAvg          Média parcial atual das ABs (null se sem notas)
 * @param effectiveAvg        Média efetiva após substituição pela REAV (null se sem REAV)
 * @param neededScore         Nota necessária na próxima avaliação (null se N/A)
 * @param neededScoreType     Qual avaliação requer a nota: "AB2" | "REAV" | "FINAL"
 * @param finalWeightedScore  Nota ponderada final: 0.6×média + 0.4×final (null se N/A)
 */
public record ApprovalForecastDTO(
    String status,
    String message,
    BigDecimal currentAvg,
    BigDecimal effectiveAvg,
    BigDecimal neededScore,
    String neededScoreType,
    BigDecimal finalWeightedScore
) {}
