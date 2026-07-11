package br.com.ufal.gradua.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.ufal.gradua.dtos.grade.ApprovalForecastDTO;
import br.com.ufal.gradua.dtos.grade.ClassWithStudentsDTO;
import br.com.ufal.gradua.dtos.grade.GradeEntryDTO;
import br.com.ufal.gradua.dtos.grade.StudentGradeDTO;
import br.com.ufal.gradua.models.academic.ClassSectionModel;
import br.com.ufal.gradua.models.academic.EnrollmentModel;
import br.com.ufal.gradua.models.academic.GradeModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.ClassSectionRepository;
import br.com.ufal.gradua.repositories.EnrollmentRepository;
import br.com.ufal.gradua.repositories.GradeRepository;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class GradeService {

    // -------------------------------------------------------------------------
    // Constantes do sistema de avaliação
    // -------------------------------------------------------------------------
    /** Média mínima para aprovação direta, sem necessidade de reavaliação. */
    private static final BigDecimal PASSING_GRADE        = new BigDecimal("7.0");
    /** Nota máxima possível em qualquer avaliação. */
    private static final BigDecimal MAX_GRADE            = new BigDecimal("10.0");
    /** Nota ponderada mínima para aprovação na reavaliação final. */
    private static final BigDecimal FINAL_PASSING_SCORE  = new BigDecimal("5.5");
    /** Peso da média parcial (AB1/AB2) na fórmula da reavaliação final. */
    private static final BigDecimal FINAL_WEIGHT_PARTIAL = new BigDecimal("0.6");
    /** Peso da nota da prova final na fórmula da reavaliação final. */
    private static final BigDecimal FINAL_WEIGHT_EXAM    = new BigDecimal("0.4");
    /** Média parcial mínima para ter acesso à reavaliação final. */
    private static final BigDecimal MIN_AVG_FOR_FINAL    = new BigDecimal("5.0");
    /** Média parcial máxima que ainda exige reavaliação final (abaixo de PASSING_GRADE). */
    private static final BigDecimal MAX_AVG_FOR_FINAL    = new BigDecimal("6.9");
    /** Soma-alvo das duas avaliações para aprovação direta (PASSING_GRADE × 2). */
    private static final BigDecimal TARGET_SUM           = new BigDecimal("14.0");
    /** Divisor para cálculo de médias de duas avaliações. */
    private static final BigDecimal TWO                  = new BigDecimal("2");

    private final GradeRepository gradeRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ClassSectionRepository classSectionRepository;

    private UserModel getUserByToken() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserModel) authentication.getPrincipal();
    }

    public List<ClassWithStudentsDTO> getProfessorClassesWithStudents() {
        UserModel user = getUserByToken();

        if (!"PROFESSOR".equalsIgnoreCase(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas professores podem acessar esta funcionalidade.");
        }

        List<ClassSectionModel> classes = classSectionRepository.findByProfessor_User_UserId(user.getUserId());
        List<ClassWithStudentsDTO> result = new ArrayList<>();

        for (ClassSectionModel cls : classes) {
            List<EnrollmentModel> enrollments = enrollmentRepository.findByClassSection(cls);
            List<StudentGradeDTO> students = new ArrayList<>();

            for (EnrollmentModel enrollment : enrollments) {
                if (enrollment.getStudent() == null) continue;

                var student = enrollment.getStudent();
                var studentUser = student.getUser();
                String studentName = (studentUser != null)
                    ? studentUser.getFirstName() + " " + studentUser.getLastName()
                    : "—";

                List<GradeModel> grades = gradeRepository.findByEnrollment(enrollment);
                Map<String, BigDecimal> gradeMap = grades.stream()
                    .collect(Collectors.toMap(
                        g -> g.getGradeType().toLowerCase(),
                        g -> g.getValue() != null ? g.getValue() : BigDecimal.ZERO
                    ));

                students.add(new StudentGradeDTO(
                    enrollment.getEnrollmentId(),
                    student.getStudentID(),
                    studentName,
                    student.getEnrollmentNumber(),
                    gradeMap.getOrDefault("ab1", null),
                    gradeMap.getOrDefault("ab2", null),
                    gradeMap.getOrDefault("reav", null),
                    gradeMap.getOrDefault("final", null)
                ));
            }

            var subject = cls.getSubject();
            result.add(new ClassWithStudentsDTO(
                cls.getClassId(),
                subject != null ? subject.getCode() : "-",
                subject != null ? subject.getName() : "-",
                cls.getAcademicTerm(),
                cls.getSchedule(),
                students
            ));
        }

        return result;
    }

    public void saveGrades(UUID classId, List<GradeEntryDTO> grades) {
        UserModel user = getUserByToken();

        ClassSectionModel cls = classSectionRepository.findById(classId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Turma não encontrada"));

        if (!cls.getProfessor().getUser().getUserId().equals(user.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não é o professor desta turma.");
        }

        for (GradeEntryDTO entry : grades) {
            EnrollmentModel enrollment = enrollmentRepository.findById(entry.enrollmentId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Matrícula não encontrada: " + entry.enrollmentId()));

            if (!enrollment.getClassSection().getClassId().equals(classId)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Matrícula não pertence a esta turma.");
            }

            String gradeType = entry.gradeType().toUpperCase();
            if (!List.of("AB1", "AB2", "REAV", "FINAL").contains(gradeType)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Tipo de nota inválido: " + entry.gradeType());
            }

            BigDecimal value = entry.value();
            if (value != null) {
                if (value.compareTo(BigDecimal.ZERO) < 0 || value.compareTo(new BigDecimal("10")) > 0) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Nota deve estar entre 0 e 10.");
                }
                if (value.scale() > 2) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Nota pode ter no máximo 2 casas decimais.");
                }
            }

            GradeModel grade = gradeRepository.findByEnrollmentAndGradeType(enrollment, gradeType)
                .orElseGet(() -> {
                    GradeModel g = new GradeModel();
                    g.setEnrollment(enrollment);
                    g.setGradeType(gradeType);
                    g.setCreatedAt(LocalDateTime.now(ZoneOffset.of("-3")));
                    return g;
                });

            grade.setValue(value);
            grade.setUpdatedAt(LocalDateTime.now(ZoneOffset.of("-3")));
            gradeRepository.save(grade);
        }
    }

    public Map<String, BigDecimal> getGradesForEnrollment(UUID enrollmentId) {
        EnrollmentModel enrollment = enrollmentRepository.findById(enrollmentId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Matrícula não encontrada"));

        List<GradeModel> grades = gradeRepository.findByEnrollment(enrollment);
        return grades.stream()
            .collect(Collectors.toMap(
                g -> g.getGradeType().toLowerCase(),
                g -> g.getValue() != null ? g.getValue() : BigDecimal.ZERO,
                (a, b) -> b
            ));
    }

    // =========================================================================
    // Calculadora de Previsão de Aprovação
    // =========================================================================

    /**
     * Calcula a previsão de aprovação de um aluno com base nas notas disponíveis.
     *
     * <p>Regras do sistema:</p>
     * <ul>
     *   <li>Média aritmética simples de AB1 e AB2 para aprovação direta (≥ 7.0).</li>
     *   <li>REAV substitui min(AB1, AB2) apenas se o valor da REAV for superior.</li>
     *   <li>Acesso à reavaliação final: média efetiva entre 5.0 e 6.9 (inclusive).</li>
     *   <li>Aprovação na final: 0.6 × médiaParcial + 0.4 × notaFinal ≥ 5.5.</li>
     * </ul>
     *
     * @param grades Mapa com as notas disponíveis: chaves "ab1", "ab2", "reav", "final".
     *               Valores ausentes devem ser {@code null} (não zero).
     * @return {@link ApprovalForecastDTO} com estado, mensagem e dados preditivos.
     */
    public ApprovalForecastDTO calculateApprovalForecast(Map<String, BigDecimal> grades) {
        BigDecimal ab1   = grades.get("ab1");
        BigDecimal ab2   = grades.get("ab2");
        BigDecimal reav  = grades.get("reav");
        BigDecimal final_ = grades.get("final");

        // -----------------------------------------------------------------
        // Caso 1: Nenhuma nota lançada
        // -----------------------------------------------------------------
        if (ab1 == null && ab2 == null) {
            return new ApprovalForecastDTO(
                "NO_GRADES",
                "Notas ainda não disponíveis.",
                null, null, null, null, null
            );
        }

        // -----------------------------------------------------------------
        // Caso 2: Apenas uma das ABs foi lançada (AB1 ou AB2)
        // -----------------------------------------------------------------
        if (ab1 == null || ab2 == null) {
            BigDecimal existingGrade = ab1 != null ? ab1 : ab2;
            String missingType = ab1 == null ? "AB1" : "AB2";
            BigDecimal needed = TARGET_SUM.subtract(existingGrade);

            if (needed.compareTo(MAX_GRADE) <= 0) {
                BigDecimal neededRounded = needed.setScale(2, RoundingMode.HALF_UP);
                return new ApprovalForecastDTO(
                    "NEEDS_SCORE",
                    String.format("Precisa de %.2f na %s para aprovação direta.", neededRounded, missingType),
                    null, null, neededRounded, missingType, null
                );
            } else {
                return new ApprovalForecastDTO(
                    "REEVALUATION_CERTAIN",
                    "Aprovação direta já não é possível. A reavaliação será necessária.",
                    null, null, null, null, null
                );
            }
        }

        // -----------------------------------------------------------------
        // A partir daqui: AB1 e AB2 estão ambas disponíveis
        // -----------------------------------------------------------------
        BigDecimal currentAvg = ab1.add(ab2).divide(TWO, 2, RoundingMode.HALF_UP);

        // -----------------------------------------------------------------
        // Caso 3: REAV foi lançada — calcular média efetiva com substituição
        // -----------------------------------------------------------------
        if (reav != null) {
            BigDecimal maxAB = ab1.max(ab2);

            // A REAV substitui a menor nota apenas se for superior a ela
            BigDecimal effectiveAvg;
            boolean reavImproved;
            if (reav.compareTo(minAB) > 0) {
                effectiveAvg = maxAB.add(reav).divide(TWO, 2, RoundingMode.HALF_UP);
                reavImproved = true;
            } else {
                effectiveAvg = currentAvg;
                reavImproved = false;
            }

            // Aprovado diretamente pela média efetiva após REAV
            if (effectiveAvg.compareTo(PASSING_GRADE) >= 0) {
                String msg = reavImproved
                    ? String.format("Aprovado(a) por média após REAV! Média efetiva: %.2f ✓", effectiveAvg)
                    : String.format("Aprovado(a) por média! Média: %.2f ✓", effectiveAvg);
                return new ApprovalForecastDTO(
                    "APPROVED", msg, currentAvg, effectiveAvg, null, null, null
                );
            }

            // Prova Final já foi lançada — calcular nota ponderada
            if (final_ != null) {
                BigDecimal weighted = FINAL_WEIGHT_PARTIAL.multiply(effectiveAvg)
                    .add(FINAL_WEIGHT_EXAM.multiply(final_))
                    .setScale(2, RoundingMode.HALF_UP);

                if (weighted.compareTo(FINAL_PASSING_SCORE) >= 0) {
                    return new ApprovalForecastDTO(
                        "APPROVED",
                        String.format("Aprovado(a) na reavaliação final! Nota ponderada: %.2f ✓", weighted),
                        currentAvg, effectiveAvg, null, null, weighted
                    );
                } else {
                    return new ApprovalForecastDTO(
                        "FAILED",
                        String.format("Reprovado(a). Nota final ponderada: %.2f (mínimo: 5.50).", weighted),
                        currentAvg, effectiveAvg, null, null, weighted
                    );
                }
            }

            // Prova Final ainda não lançada — verificar elegibilidade
            if (effectiveAvg.compareTo(MIN_AVG_FOR_FINAL) >= 0) {
                // Nota necessária na final: (5.5 - 0.6 × médiaParcial) / 0.4
                BigDecimal neededFinal = FINAL_PASSING_SCORE
                    .subtract(FINAL_WEIGHT_PARTIAL.multiply(effectiveAvg))
                    .divide(FINAL_WEIGHT_EXAM, 2, RoundingMode.HALF_UP);

                String suffix = reavImproved
                    ? String.format(" (REAV substituiu a menor AB; nova média: %.2f)", effectiveAvg)
                    : " (REAV não substituiu — valor inferior à menor AB)";

                return new ApprovalForecastDTO(
                    "NEEDS_FINAL",
                    String.format("Média após REAV: %.2f%s — Na prova final, precisa de %.2f para aprovação.",
                        effectiveAvg, suffix, neededFinal),
                    currentAvg, effectiveAvg, neededFinal, "FINAL", null
                );
            } else {
                return new ApprovalForecastDTO(
                    "FAILED",
                    String.format("Média após REAV: %.2f — Insuficiente para acesso à reavaliação final (mínimo: 5.00).",
                        effectiveAvg),
                    currentAvg, effectiveAvg, null, null, null
                );
            }
        }

        // -----------------------------------------------------------------
        // Caso 4: Ambas ABs, sem REAV
        // -----------------------------------------------------------------

        // Aprovado diretamente pela média das ABs
        if (currentAvg.compareTo(PASSING_GRADE) >= 0) {
            return new ApprovalForecastDTO(
                "APPROVED",
                String.format("Aprovado(a) por média! Média: %.2f ✓", currentAvg),
                currentAvg, null, null, null, null
            );
        }

        // Verificar se a REAV pode garantir aprovação direta
        BigDecimal maxAB = ab1.max(ab2);
        BigDecimal neededReav = TARGET_SUM.subtract(maxAB);

        if (neededReav.compareTo(MAX_GRADE) <= 0) {
            BigDecimal neededRounded = neededReav.setScale(2, RoundingMode.HALF_UP);
            String substituting = ab1.compareTo(ab2) <= 0 ? "AB1" : "AB2";
            return new ApprovalForecastDTO(
                "NEEDS_REAV",
                String.format(
                    "Média atual: %.2f — Na REAV, precisa de %.2f (substituindo a %s) para aprovação direta.",
                    currentAvg, neededRounded, substituting),
                currentAvg, null, neededRounded, "REAV", null
            );
        }

        // A REAV não garante aprovação direta; verificar se pode dar acesso à Final
        BigDecimal bestPossibleAvgWithReav = maxAB.add(MAX_GRADE).divide(TWO, 2, RoundingMode.HALF_UP);
        if (bestPossibleAvgWithReav.compareTo(MIN_AVG_FOR_FINAL) >= 0) {
            return new ApprovalForecastDTO(
                "REAV_MAY_SAVE",
                String.format(
                    "Aprovação direta já não é possível. Mas a REAV ainda pode garantir acesso à reavaliação final (melhor média possível: %.2f).",
                    bestPossibleAvgWithReav),
                currentAvg, null, null, "REAV", null
            );
        }

        // Nem a melhor REAV possível garante acesso à final
        return new ApprovalForecastDTO(
            "FAILED",
            String.format(
                "Média atual: %.2f — Aprovação já não é possível neste período.",
                currentAvg),
            currentAvg, null, null, null, null
        );
    }
}
