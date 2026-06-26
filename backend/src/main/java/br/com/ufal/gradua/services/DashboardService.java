package br.com.ufal.gradua.services;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Base64;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import br.com.ufal.gradua.dtos.UpdateProfileRequestDTO;
import br.com.ufal.gradua.models.agenda.MonitorSessionModel;
import br.com.ufal.gradua.models.institutional.CurriculumModel;
import br.com.ufal.gradua.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import br.com.ufal.gradua.dtos.dashboard.DashboardStatsDTO;
import br.com.ufal.gradua.dtos.dashboard.DashboardSubjectDTO;
import br.com.ufal.gradua.models.academic.AbsencesDTO;
import br.com.ufal.gradua.models.academic.ClassSectionModel;
import br.com.ufal.gradua.models.academic.EnrollmentModel;
import br.com.ufal.gradua.models.academic.GradeModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.AnnouncementRepository;
import br.com.ufal.gradua.repositories.EnrollmentRepository;
import br.com.ufal.gradua.repositories.GradeRepository;
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
    private final GradeRepository gradeRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private UserModel getUserByToken() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserModel) authentication.getPrincipal();
    }
    private UserModel getUserWithStudent() {
        UserModel user = (UserModel) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findWithStudentByUserId(user.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }
    public DashboardStatsDTO getStatsForCurrentUser() {
        UserModel user = getUserWithStudent();;
        var student = user.getStudent();

        if (student != null) {
            double ira = student.getIra() != null ? student.getIra().doubleValue() : 0.0;

            CurriculumModel curriculum = student.getCurriculum();

            int totalHoursRequired = (curriculum != null && curriculum.getReqTotalHours() != null)
                    ? curriculum.getReqTotalHours() : 240;

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

            int participants = enrollmentRepository.countByClassSection(cls);

            List<GradeModel> gradeList = gradeRepository.findByEnrollment(e);
            java.util.Map<String, java.math.BigDecimal> gradeMap = new java.util.HashMap<>();
            gradeMap.put("ab1", null);
            gradeMap.put("ab2", null);
            gradeMap.put("reav", null);
            gradeMap.put("final", null);
            for (GradeModel g : gradeList) {
                if (g.getValue() != null) {
                    gradeMap.put(g.getGradeType().toLowerCase(), g.getValue());
                }
            }

            int registered = e.getAbsences() != null ? e.getAbsences() : 0;
            Integer creditHours = subj != null ? subj.getCreditHours() : null;
            int maxAbsences = creditHours != null ? (int) Math.ceil(creditHours * 0.25) : 999;
            int remaining = Math.max(0, maxAbsences - registered);

            return new DashboardSubjectDTO(
                    cls.getClassId(), code, name, schedule, "Instituto de Computação", "Teórica",
                    professor, participants, List.of(), gradeMap,
                    new AbsencesDTO(registered, remaining), "Em dia"
            );
        }).collect(Collectors.toList());
    }

    public List<Object> getAnnouncements() {
        return new ArrayList<>(forumTopicService.listAll("aviso"));
    }

    public List<Object> getAgenda(LocalDate date) {
        UserModel user = getUserWithStudent(); // Garante o Student carregado
        List<EnrollmentModel> enrollments = enrollmentRepository.findByStudent(user.getStudent());

        List<Object> agendaList = new ArrayList<>();

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
        UserModel user = getUserWithStudent();
        var student = user.getStudent();

        if (student != null) {
            return new br.com.ufal.gradua.dtos.ProfileDTO(
                    user.getUserId(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getRole(), user.getCpf(), user.getPassport(),
                    student.getStudentID(), student.getEnrollmentNumber(), student.getCurrentTerm(), student.getIra(), user.getProfilePhoto()
            );
        }

        return new br.com.ufal.gradua.dtos.ProfileDTO(
                user.getUserId(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getRole(), user.getCpf(), user.getPassport(),
                null, null, null, null, user.getProfilePhoto()
        );
    }

    public Object updateProfile(UpdateProfileRequestDTO dto) {
        UserModel user = getUserByToken();

        if (dto.currentPassword() == null || dto.currentPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Senha atual é obrigatória");
        }

        if (!passwordEncoder.matches(dto.currentPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Senha atual incorreta");
        }

        if (dto.email() != null && !dto.email().isBlank()) {
            userRepository.findByEmail(dto.email()).ifPresent(existing -> {
                if (!existing.getUserId().equals(user.getUserId())) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Email já está em uso");
                }
            });
            user.setEmail(dto.email());
        }

        if (dto.newPassword() != null && !dto.newPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(dto.newPassword()));
        }

        userRepository.save(user);
        return getProfileForCurrentUser();
    }

    public Object uploadProfilePhoto(MultipartFile file) {
        UserModel user = getUserByToken();

        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Arquivo vazio");
        }

        try {
            byte[] bytes = file.getBytes();
            String base64 = Base64.getEncoder().encodeToString(bytes);

            String contentType = file.getContentType();
            if (contentType == null) contentType = "image/png";
            String dataUri = "data:" + contentType + ";base64," + base64;

            user.setProfilePhoto(dataUri);
            userRepository.save(user);

            return java.util.Map.of("photoUrl", dataUri);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao salvar foto");
        }
    }
}