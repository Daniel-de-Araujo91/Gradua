package br.com.ufal.gradua.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.ufal.gradua.dtos.agenda.AgendaClassDTO;
import br.com.ufal.gradua.dtos.agenda.AgendaDiaDTO;
import br.com.ufal.gradua.dtos.agenda.MonitorSessionResponseDTO;
import br.com.ufal.gradua.dtos.agenda.ReminderRequestDTO;
import br.com.ufal.gradua.dtos.agenda.ReminderResponseDTO;
import br.com.ufal.gradua.models.academic.ClassSectionModel;
import br.com.ufal.gradua.models.academic.EnrollmentModel;
import br.com.ufal.gradua.models.agenda.MonitorSessionModel;
import br.com.ufal.gradua.models.agenda.ReminderModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.ClassSectionRepository;
import br.com.ufal.gradua.repositories.EnrollmentRepository;
import br.com.ufal.gradua.repositories.MonitorSessionRepository;
import br.com.ufal.gradua.repositories.ReminderRepository;
import br.com.ufal.gradua.repositories.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AgendaService {

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ClassSectionRepository classSectionRepository;
    private final MonitorSessionRepository monitorSessionRepository;
    private final ReminderRepository reminderRepository;

    private UserModel getUser() {
        UserModel user = (UserModel) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(user.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }

    public AgendaDiaDTO getAgendaDoDia(LocalDate date) {
        UserModel user = getUser();
        List<ClassSectionModel> turmas;

        if (user.getStudent() != null) {
            List<EnrollmentModel> enrollments = enrollmentRepository.findByStudent(user.getStudent());
            turmas = enrollments.stream().map(e -> e.getClassSection()).toList();
        } else {
            UserModel userWithProfessor = userRepository.findWithProfessorByUserId(user.getUserId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Usuário sem vínculo acadêmico"));
            turmas = classSectionRepository.findByProfessor_User_UserId(userWithProfessor.getUserId());
        }

        List<AgendaClassDTO> classes = turmas.stream().map(t -> new AgendaClassDTO(
                t.getClassId(),
                t.getSubject() != null ? t.getSubject().getName() : "Sem Nome",
                t.getSubject() != null ? t.getSubject().getCode() : "SEM-COD",
                t.getSchedule(),
                t.getLocation()
        )).toList();

        List<MonitorSessionModel> sessoesModel = new ArrayList<>();
        if (!turmas.isEmpty()) {
            sessoesModel = monitorSessionRepository.findByClassSectionInAndDateOrderByStartTimeAsc(turmas, date);
        }

        List<MonitorSessionResponseDTO> sessoes = sessoesModel.stream().map(m -> {
            String monitorName = m.getMonitor() != null && m.getMonitor().getStudent() != null
                    ? m.getMonitor().getStudent().getUser().getFirstName() : "Monitor";
            String subjectName = m.getClassSection() != null && m.getClassSection().getSubject() != null
                    ? m.getClassSection().getSubject().getName() : "Disciplina";

            return new MonitorSessionResponseDTO(
                    m.getSessionId(), m.getTopic(), m.getDate(), m.getStartTime(), m.getEndTime(),
                    m.getLocation(), m.getMeetingLink(), monitorName, subjectName,
                    m.getClassSection() != null ? m.getClassSection().getClassId().toString() : null
            );
        }).toList();

        List<ReminderModel> lembretesModel = reminderRepository.findByUserAndDateOrderByTimeAsc(user, date);
        List<ReminderResponseDTO> reminders = lembretesModel.stream().map(l -> new ReminderResponseDTO(
                l.getReminderId(), l.getTitle(), l.getDate(), l.getTime(), l.getLocation()
        )).toList();

        return new AgendaDiaDTO(classes, sessoes, reminders);
    }

    public ReminderResponseDTO createReminder(ReminderRequestDTO dto) {
        UserModel user = getUser();

        ReminderModel reminder = new ReminderModel();
        reminder.setUser(user);
        reminder.setTitle(dto.title());
        reminder.setDate(dto.date());
        reminder.setTime(dto.time());
        reminder.setLocation(dto.location());

        reminderRepository.save(reminder);

        return new ReminderResponseDTO(
                reminder.getReminderId(), reminder.getTitle(), reminder.getDate(), reminder.getTime(), reminder.getLocation()
        );
    }

    public ReminderResponseDTO updateReminder(UUID reminderId, ReminderRequestDTO dto) {
        UserModel user = getUser();
        ReminderModel reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lembrete não encontrado"));

        if (!reminder.getUser().getUserId().equals(user.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Não autorizado a editar este lembrete");
        }

        reminder.setTitle(dto.title());
        reminder.setDate(dto.date());
        reminder.setTime(dto.time());
        reminder.setLocation(dto.location());

        reminderRepository.save(reminder);

        return new ReminderResponseDTO(
                reminder.getReminderId(), reminder.getTitle(), reminder.getDate(), reminder.getTime(), reminder.getLocation()
        );
    }

    public void deleteReminder(UUID reminderId) {
        UserModel user = getUser();
        ReminderModel reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lembrete não encontrado"));

        if (!reminder.getUser().getUserId().equals(user.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Não autorizado a excluir este lembrete");
        }

        reminderRepository.delete(reminder);
    }
}