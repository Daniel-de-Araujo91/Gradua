package br.com.ufal.gradua.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.ufal.gradua.models.academic.AttendanceDTO;
import br.com.ufal.gradua.models.academic.ClassAttendanceModel;
import br.com.ufal.gradua.models.academic.ClassSectionModel;
import br.com.ufal.gradua.models.academic.ClassSessionDTO;
import br.com.ufal.gradua.models.academic.ClassSessionModel;
import br.com.ufal.gradua.models.academic.EnrollmentModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.ClassAttendanceRepository;
import br.com.ufal.gradua.repositories.ClassSectionRepository;
import br.com.ufal.gradua.repositories.ClassSessionRepository;
import br.com.ufal.gradua.repositories.EnrollmentRepository;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ClassSessionService {

    private final ClassSectionRepository classSectionRepository;
    private final ClassSessionRepository classSessionRepository;
    private final ClassAttendanceRepository classAttendanceRepository;
    private final EnrollmentRepository enrollmentRepository;

    private UserModel getUserByToken() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserModel) authentication.getPrincipal();
    }

    private ClassSectionModel validateProfessorClass(UUID classId) {
        UserModel user = getUserByToken();

        if (!"PROFESSOR".equalsIgnoreCase(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas professores podem gerenciar aulas.");
        }

        ClassSectionModel cls = classSectionRepository.findById(classId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Turma não encontrada"));

        if (!cls.getProfessor().getUser().getUserId().equals(user.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não é o professor desta turma.");
        }

        return cls;
    }

    public ClassSessionDTO createSession(UUID classId, LocalDate date, String description) {
        ClassSectionModel cls = validateProfessorClass(classId);

        if (date == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Data é obrigatória.");
        }

        ClassSessionModel session = new ClassSessionModel();
        session.setClassSection(cls);
        session.setDate(date);
        session.setDescription(description != null ? description : "");
        session.setCreatedAt(LocalDateTime.now(ZoneOffset.of("-3")));

        ClassSessionModel saved = classSessionRepository.save(session);

        return new ClassSessionDTO(saved.getSessionId(), cls.getClassId(), saved.getDate(), saved.getDescription());
    }

    public List<ClassSessionDTO> getSessions(UUID classId) {
        ClassSectionModel cls = validateProfessorClass(classId);

        return classSessionRepository.findByClassSectionOrderByDateDesc(cls).stream()
            .map(s -> new ClassSessionDTO(s.getSessionId(), cls.getClassId(), s.getDate(), s.getDescription()))
            .collect(Collectors.toList());
    }

    public void deleteSession(UUID sessionId) {
        ClassSessionModel session = classSessionRepository.findById(sessionId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aula não encontrada"));

        validateProfessorClass(session.getClassSection().getClassId());

        classAttendanceRepository.findByClassSession(session).forEach(a -> classAttendanceRepository.delete(a));
        classSessionRepository.delete(session);
    }

    public List<AttendanceDTO> getAttendanceForSession(UUID sessionId) {
        ClassSessionModel session = classSessionRepository.findById(sessionId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aula não encontrada"));

        validateProfessorClass(session.getClassSection().getClassId());

        List<EnrollmentModel> enrollments = enrollmentRepository.findByClassSection(session.getClassSection());
        List<AttendanceDTO> result = new ArrayList<>();

        for (EnrollmentModel enrollment : enrollments) {
            if (enrollment.getStudent() == null) continue;

            String studentName = enrollment.getStudent().getUser() != null
                ? enrollment.getStudent().getUser().getFirstName() + " " + enrollment.getStudent().getUser().getLastName()
                : "—";

            var existing = classAttendanceRepository.findByClassSessionAndEnrollment(session, enrollment);

            result.add(new AttendanceDTO(
                enrollment.getEnrollmentId(),
                studentName,
                existing.map(a -> a.getPresent()).orElse(null)
            ));
        }

        return result;
    }

    public void markAttendance(UUID sessionId, List<AttendanceDTO> attendanceList) {
        ClassSessionModel session = classSessionRepository.findById(sessionId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aula não encontrada"));

        validateProfessorClass(session.getClassSection().getClassId());

        for (AttendanceDTO dto : attendanceList) {
            if (dto.getPresent() == null) continue;

            EnrollmentModel enrollment = enrollmentRepository.findById(dto.getEnrollmentId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Matrícula não encontrada: " + dto.getEnrollmentId()));

            ClassAttendanceModel attendance = classAttendanceRepository
                .findByClassSessionAndEnrollment(session, enrollment)
                .orElseGet(() -> {
                    ClassAttendanceModel a = new ClassAttendanceModel();
                    a.setClassSession(session);
                    a.setEnrollment(enrollment);
                    return a;
                });

            attendance.setPresent(dto.getPresent());
            classAttendanceRepository.save(attendance);
        }

        recalculateAbsences(session.getClassSection());
    }

    private void recalculateAbsences(ClassSectionModel classSection) {
        List<EnrollmentModel> enrollments = enrollmentRepository.findByClassSection(classSection);

        for (EnrollmentModel enrollment : enrollments) {
            long absences = classAttendanceRepository.countByEnrollmentAndPresentFalse(enrollment);
            enrollment.setAbsences((int) absences);
            enrollmentRepository.save(enrollment);
        }
    }
}
