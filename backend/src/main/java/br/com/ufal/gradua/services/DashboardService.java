package br.com.ufal.gradua.services;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.ufal.gradua.dtos.dashboard.DashboardStatsDTO;
import br.com.ufal.gradua.dtos.dashboard.DashboardSubjectDTO;
import br.com.ufal.gradua.models.academic.EnrollmentModel;
import br.com.ufal.gradua.repositories.MonitorSessionRepository;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
@Transactional
@RequiredArgsConstructor
public class DashboardService {

    private final EnrollmentRepository enrollmentRepository;
    private final ForumTopicService forumTopicService;
    private final MonitorSessionRepository monitorSessionRepository;

    private UserModel getUserByToken() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserModel) authentication.getPrincipal();
    }

    public DashboardStatsDTO getStatsForCurrentUser() {
        // Prefer values from the StudentModel when available
        UserModel user = getUserByToken();
        var student = user.getStudent();
        if (student != null) {
            double ira = student.getIra() != null ? student.getIra().doubleValue() : 0.0;
            // integralization percent: estimate from totalHours / (assume degree requires 240 credits)
            int integral = 0;
            if (student.getTotalHours() != null) {
                int total = student.getTotalHours();
                // assume program requirement 240 (this is a seed assumption)
                integral = Math.min(100, (int) Math.round((total / 240.0) * 100.0));
            }
            int hoursPending = 0;
            if (student.getTotalHours() != null) {
                hoursPending = Math.max(0, 240 - student.getTotalHours());
            }

            return new DashboardStatsDTO(ira, integral, hoursPending);
        }

        // Fallback to conservative defaults
        double ira = 0.0;
        int integral = 0;
        int hoursPending = 999;
        return new DashboardStatsDTO(ira, integral, hoursPending);
    }

    public List<DashboardSubjectDTO> getSubjectsForCurrentUser() {
        UserModel user = getUserByToken();
        List<EnrollmentModel> enrollments = enrollmentRepository.findByStudent(user.getStudent());

        return enrollments.stream().map(e -> {
            var cls = e.getClassSection();
            var subj = cls.getSubject();
            String code = subj != null ? subj.getCode() : "-";
            String name = subj != null ? subj.getName() : "-";
            String schedule = cls.getAcademicTerm() != null ? cls.getAcademicTerm() : "2026.1";
            String location = "Instituto de Computação";
            String type = "Teórica";
            String professor = "-";
            if (cls.getProfessor() != null && cls.getProfessor().getUser() != null) {
                var pu = cls.getProfessor().getUser();
                professor = (pu.getFirstName() == null ? "" : pu.getFirstName()) +
                    (pu.getLastName() == null ? "" : " " + pu.getLastName());
            }
            int participants = enrollmentRepository.findByClassSection(cls).size();
            java.util.List<String> monitors = java.util.List.of();
            Object grades = new Object();
            Object absences = new Object();
            String delivery = "Em dia";

            return new DashboardSubjectDTO(
                cls.getClassId(),
                code, name, schedule, location, type, professor, participants, monitors, grades, absences, delivery
            );
        }).collect(Collectors.toList());
    }

    public List<Object> getAnnouncements() {
        // Reuse forum service to fetch AVISO-type topics
        return forumTopicService.listAll("aviso").stream().map(t -> (Object) t).collect(Collectors.toList());
    }

    public List<Object> getAgendaForToday() {
        UserModel user = getUserByToken();
        var enrollments = enrollmentRepository.findByStudent(user.getStudent());
        var today = java.time.LocalDate.now();

        return enrollments.stream().flatMap(e -> {
            var cls = e.getClassSection();
            var sessions = monitorSessionRepository.findByClassSectionOrderByDateAscStartTimeAsc(cls);
            return sessions.stream().filter(s -> s.getDate().equals(today)).map(s -> (Object) s);
        }).collect(Collectors.toList());
    }

    public Object getProfileForCurrentUser() {
        UserModel user = getUserByToken();
        var student = user.getStudent();
        if (student != null) {
            return new br.com.ufal.gradua.dtos.ProfileDTO(
                user.getUserId(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getRole(), user.getCpf(), user.getPassport(),
                student.getStudentID(), student.getEnrollmentNumber(), student.getCurrentTerm(), student.getIra()
            );
        }

        return new br.com.ufal.gradua.dtos.ProfileDTO(
            user.getUserId(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getRole(), user.getCpf(), user.getPassport(),
            null, null, null, null
        );
    }
}
