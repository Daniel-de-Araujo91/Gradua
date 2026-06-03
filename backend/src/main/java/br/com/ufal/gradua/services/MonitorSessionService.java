package br.com.ufal.gradua.services;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.ufal.gradua.dtos.agenda.MonitorSessionRequestDTO;
import br.com.ufal.gradua.dtos.agenda.MonitorSessionResponseDTO;
import br.com.ufal.gradua.models.academic.ClassSectionModel;
import br.com.ufal.gradua.models.agenda.MonitorSessionModel;
import br.com.ufal.gradua.models.agenda.NotificationModel;
import br.com.ufal.gradua.models.auth.MonitorModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.ClassSectionRepository;
import br.com.ufal.gradua.repositories.EnrollmentRepository;
import br.com.ufal.gradua.repositories.MonitorRepository;
import br.com.ufal.gradua.repositories.MonitorSessionRepository;
import br.com.ufal.gradua.repositories.NotificationRepository;

@Service
@Transactional
public class MonitorSessionService {

    @Autowired MonitorSessionRepository sessionRepository;
    @Autowired NotificationRepository notificationRepository;
    @Autowired ClassSectionRepository classSectionRepository;
    @Autowired EnrollmentRepository enrollmentRepository;
    @Autowired MonitorRepository monitorRepository;

    private UserModel getUserByToken() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserModel) authentication.getPrincipal();
    }

    private MonitorSessionResponseDTO toDTO(MonitorSessionModel session) {
        String monitorName = "";
        if (session.getMonitor() != null && session.getMonitor().getStudent() != null
                && session.getMonitor().getStudent().getUser() != null) {
            UserModel mu = session.getMonitor().getStudent().getUser();
            monitorName = mu.getFirstName() + " " + mu.getLastName();
        }
        String subjectName = session.getClassSection() != null && session.getClassSection().getSubject() != null
                ? session.getClassSection().getSubject().getName() : "";
        String classSectionId = session.getClassSection() != null
                ? session.getClassSection().getClassId().toString() : null;

        return new MonitorSessionResponseDTO(
            session.getSessionId(),
            session.getTopic(),
            session.getDate(),
            session.getStartTime(),
            session.getEndTime(),
            session.getLocation(),
            session.getMeetingLink(),
            monitorName,
            subjectName,
            classSectionId
        );
    }

    /**
     * Cria uma sessão de monitoria e dispara notificações em lote para todos
     * os alunos matriculados na turma (spec 4.2 e Fase 2).
     * Apenas usuários com role MONITOR podem chamar este método.
     */
    public MonitorSessionResponseDTO createSession(MonitorSessionRequestDTO dto) {
        UserModel user = getUserByToken();

        // Validação de autorização: apenas MONITOR pode criar sessões (spec 1.2)
        if (!"MONITOR".equalsIgnoreCase(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "Apenas monitores podem agendar sessões de monitoria.");
        }

        // Buscar entidade MonitorModel vinculada ao usuário
        MonitorModel monitor = monitorRepository.findByStudent(user.getStudent())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN,
                "Usuário não possui cadastro de monitor ativo."));

        // Buscar turma
        ClassSectionModel classSection = classSectionRepository.findById(dto.classSectionId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Turma não encontrada."));

        // Criar sessão
        MonitorSessionModel session = new MonitorSessionModel();
        session.setMonitor(monitor);
        session.setClassSection(classSection);
        session.setTopic(dto.topic());
        session.setDate(dto.date());
        session.setStartTime(dto.startTime());
        session.setEndTime(dto.endTime());
        session.setLocation(dto.location());
        session.setMeetingLink(dto.meetingLink());
        sessionRepository.save(session);

        // Spec 4.2 + Fase 2: buscar todos os alunos matriculados e gerar notificações em lote
        List<UserModel> enrolledUsers = enrollmentRepository.findEnrolledUsersByClassSection(classSection);
        String subjectName = classSection.getSubject() != null ? classSection.getSubject().getName() : "Monitoria";
        String message = String.format("Nova sessão de monitoria de %s agendada para %s das %s às %s. Local: %s",
            subjectName,
            dto.date(),
            dto.startTime(),
            dto.endTime(),
            dto.location() != null ? dto.location() : (dto.meetingLink() != null ? dto.meetingLink() : "A definir")
        );

        LocalDateTime now = LocalDateTime.now(ZoneOffset.of("-3"));
        List<NotificationModel> notifications = enrolledUsers.stream().map(enrolledUser -> {
            NotificationModel notif = new NotificationModel();
            notif.setRecipientUser(enrolledUser);
            notif.setMonitorSession(session);
            notif.setMessage(message);
            notif.setIsRead(false);
            notif.setCreatedAt(now);
            return notif;
        }).collect(Collectors.toList());

        notificationRepository.saveAll(notifications);

        return toDTO(session);
    }

    /** Lista sessões do monitor autenticado. */
    public List<MonitorSessionResponseDTO> listMySessionsAsMonitor() {
        UserModel user = getUserByToken();
        if (!"MONITOR".equalsIgnoreCase(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso restrito a monitores.");
        }
        MonitorModel monitor = monitorRepository.findByStudent(user.getStudent())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Monitor não encontrado."));

        return sessionRepository.findByMonitorOrderByDateAscStartTimeAsc(monitor)
            .stream().map(this::toDTO).collect(Collectors.toList());
    }

    /** Lista todas as sessões de uma turma (visível para alunos e monitores). */
    public List<MonitorSessionResponseDTO> listByClassSection(UUID classSectionId) {
        ClassSectionModel classSection = classSectionRepository.findById(classSectionId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Turma não encontrada."));
        return sessionRepository.findByClassSectionOrderByDateAscStartTimeAsc(classSection)
            .stream().map(this::toDTO).collect(Collectors.toList());
    }
}
