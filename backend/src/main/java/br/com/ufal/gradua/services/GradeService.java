package br.com.ufal.gradua.services;

import java.math.BigDecimal;
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
}
