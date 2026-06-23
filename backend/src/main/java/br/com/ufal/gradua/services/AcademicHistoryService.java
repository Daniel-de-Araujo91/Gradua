package br.com.ufal.gradua.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.ufal.gradua.dtos.AcademicHistoryDTO;
import br.com.ufal.gradua.models.academic.AcademicHistoryModel;
import br.com.ufal.gradua.models.academic.EnrollmentModel;
import br.com.ufal.gradua.models.academic.GradeModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.AcademicHistoryRepository;
import br.com.ufal.gradua.repositories.EnrollmentRepository;
import br.com.ufal.gradua.repositories.GradeRepository;
import br.com.ufal.gradua.repositories.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AcademicHistoryService {

    private final AcademicHistoryRepository academicHistoryRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final GradeRepository gradeRepository;
    private final UserRepository userRepository;

    private UserModel getUserWithStudent() {
        UserModel user = (UserModel) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findWithStudentByUserId(user.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }

    public List<AcademicHistoryDTO> getHistoryForCurrentUser() {
        UserModel user = getUserWithStudent();
        var student = user.getStudent();

        if (student == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas alunos possuem histórico acadêmico.");
        }

        List<AcademicHistoryDTO> result = new ArrayList<>();

        List<AcademicHistoryModel> storedHistory = academicHistoryRepository.findByStudentOrderByAcademicTerm(student);
        if (!storedHistory.isEmpty()) {
            for (AcademicHistoryModel h : storedHistory) {
                var subject = h.getSubject();
                result.add(new AcademicHistoryDTO(
                    subject != null ? subject.getSubjectId() : null,
                    subject != null ? subject.getCode() : "-",
                    subject != null ? subject.getName() : "-",
                    h.getAcademicTerm(),
                    h.getFinalGrade(),
                    h.getStatus(),
                    subject != null ? subject.getCreditHours() : 0,
                    h.getProfessorName(),
                    h.getFrequency(),
                    h.getSubjectType()
                ));
            }
            return result;
        }

        List<EnrollmentModel> enrollments = enrollmentRepository.findByStudent(student);
        for (EnrollmentModel enrollment : enrollments) {
            var cls = enrollment.getClassSection();
            if (cls == null) continue;
            var subject = cls.getSubject();
            if (subject == null) continue;

            List<GradeModel> grades = gradeRepository.findByEnrollment(enrollment);
            Map<String, BigDecimal> gradeMap = grades.stream()
                .filter(g -> g.getValue() != null)
                .collect(Collectors.toMap(
                    g -> g.getGradeType().toLowerCase(),
                    g -> g.getValue(),
                    (a, b) -> b
                ));

            BigDecimal finalGrade = gradeMap.getOrDefault("final",
                gradeMap.getOrDefault("reav",
                    gradeMap.getOrDefault("ab2",
                        gradeMap.getOrDefault("ab1", null))));

            String professorName = "-";
            if (cls.getProfessor() != null && cls.getProfessor().getUser() != null) {
                var pu = cls.getProfessor().getUser();
                professorName = pu.getFirstName() + " " + pu.getLastName();
            }

            String status = finalGrade != null ? (finalGrade.compareTo(new BigDecimal("5.5")) >= 0 ? "APR" : "REP") : "MATRICULADO";

            result.add(new AcademicHistoryDTO(
                subject.getSubjectId(),
                subject.getCode(),
                subject.getName(),
                cls.getAcademicTerm(),
                finalGrade,
                status,
                subject.getCreditHours(),
                professorName,
                enrollment.getAbsences(),
                null
            ));
        }

        return result;
    }
}
