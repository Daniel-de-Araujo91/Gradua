package br.com.ufal.gradua.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import br.com.ufal.gradua.models.agenda.MonitorSessionModel;
import br.com.ufal.gradua.models.institutional.CurriculumModel;
import br.com.ufal.gradua.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.ufal.gradua.dtos.dashboard.DashboardStatsDTO;
import br.com.ufal.gradua.dtos.dashboard.DashboardSubjectDTO;
import br.com.ufal.gradua.models.academic.ClassSectionModel;
import br.com.ufal.gradua.models.academic.EnrollmentModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.AnnouncementRepository;
import br.com.ufal.gradua.repositories.EnrollmentRepository;
import br.com.ufal.gradua.repositories.MonitorSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
@RequiredArgsConstructor
public class DashboardService {

    private final EnrollmentRepository enrollmentRepository;
    private final ForumTopicService forumTopicService;
    private final MonitorSessionRepository monitorSessionRepository;
    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    private UserModel getUserByToken() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserModel) authentication.getPrincipal();
    }
    private UserModel getUserWithStudent() {
        UserModel user = (UserModel) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        // Busca a versão com @EntityGraph, garantindo que o student não seja um proxy
        return userRepository.findWithStudentByUserId(user.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }
    public DashboardStatsDTO getStatsForCurrentUser() {
        UserModel user = getUserWithStudent();;
        var student = user.getStudent();

        if (student != null) {
            double ira = student.getIra() != null ? student.getIra().doubleValue() : 0.0;

            // 2. Acessa o objeto curriculum que agora está carregado na memória
            CurriculumModel curriculum = student.getCurriculum();

            // Define o total exigido baseado no currículo, ou 240 como segurança
            int totalHoursRequired = (curriculum != null && curriculum.getReqTotalHours() != null)
                    ? curriculum.getReqTotalHours() : 240;

            // 3. Calcula com valores dinâmicos
            int integral = 0;
            if (student.getTotalHours() != null && totalHoursRequired > 0) {
                integral = Math.min(100, (int) Math.round((student.getTotalHours() / (double) totalHoursRequired) * 100.0));
            }

            int hoursPending = 0;
            if (student.getTotalHours() != null) {
                hoursPending = Math.max(0, totalHoursRequired - student.getTotalHours());
            }

            return new DashboardStatsDTO(ira, integral, hoursPending);
        }

        return new DashboardStatsDTO(0.0, 0, 999);
    }

    public List<DashboardSubjectDTO> getSubjectsForCurrentUser() {
        UserModel user = getUserByToken();
        // A mágica acontece aqui: o Repository agora traz a árvore inteira via EntityGraph
        List<EnrollmentModel> enrollments = enrollmentRepository.findByStudent(user.getStudent());

        return enrollments.stream().map(e -> {
            var cls = e.getClassSection();
            var subj = cls.getSubject();

            String code = subj != null ? subj.getCode() : "-";
            String name = subj != null ? subj.getName() : "-";
            String schedule = cls.getAcademicTerm() != null ? cls.getAcademicTerm() : "2026.1";
            String professor = "-";

            if (cls.getProfessor() != null && cls.getProfessor().getUser() != null) {
                var pu = cls.getProfessor().getUser();
                professor = (pu.getFirstName() == null ? "" : pu.getFirstName()) +
                        (pu.getLastName() == null ? "" : " " + pu.getLastName());
            }

            // Aqui usamos o COUNT otimizado direto no PostgreSQL
            int participants = enrollmentRepository.countByClassSection(cls);

            return new DashboardSubjectDTO(
                    cls.getClassId(), code, name, schedule, "Instituto de Computação", "Teórica",
                    professor, participants, List.of(), new Object(), new Object(), "Em dia"
            );
        }).collect(Collectors.toList());
    }

    public List<Object> getAnnouncements() {

        var anns = announcementRepository.findAllByOrderByPublishDateDesc();

        if (!anns.isEmpty()) {
            return new ArrayList<>(anns);
        }

        return new ArrayList<>(forumTopicService.listAll("aviso"));
    }

    public List<Object> getAgenda(LocalDate date) {
        UserModel user = getUserWithStudent(); // Garante o Student carregado
        List<EnrollmentModel> enrollments = enrollmentRepository.findByStudent(user.getStudent());

        List<Object> agendaList = new ArrayList<>();

        // 1. Adiciona as Aulas (Turmas matriculadas)
        for (var e : enrollments) {
            var cls = e.getClassSection();
            var subj = cls.getSubject();

            java.util.Map<String, Object> aula = new java.util.HashMap<>();
            aula.put("type", "CLASS");
            aula.put("title", subj != null ? subj.getName() : "-");
            aula.put("startTime", cls); // Ajuste conforme seu model
            aula.put("location", cls);
            agendaList.add(aula);
        }

        // 2. Adiciona as Monitorias (via MonitorSessionRepository)
        List<ClassSectionModel> userClasses = enrollments.stream()
                .map(EnrollmentModel::getClassSection)
                .collect(Collectors.toList());

        if (!userClasses.isEmpty()) {
            var monitorias = monitorSessionRepository.findByClassSectionInAndDateOrderByStartTimeAsc(userClasses, date);
            for (var m : monitorias) {
                java.util.Map<String, Object> monitoria = new java.util.HashMap<>();
                monitoria.put("type", "MONITORIA");
                monitoria.put("title", "Monitoria: " + m.getTopic());
                monitoria.put("startTime", m.getStartTime());
                monitoria.put("location", m.getLocation());
                agendaList.add(monitoria);
            }
        }

        return agendaList;
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