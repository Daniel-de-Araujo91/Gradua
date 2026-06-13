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
        // Currently returns computed/static values but sourced from backend.
        // In future, compute from AcademicHistoryModel etc.
        double ira = 7.5;
        int integral = 68;
        int hoursPending = 840;
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
}
