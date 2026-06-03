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

import br.com.ufal.gradua.dtos.agenda.MonitorSessionResponseDTO;
import br.com.ufal.gradua.dtos.agenda.NotificationResponseDTO;
import br.com.ufal.gradua.models.agenda.MonitorSessionModel;
import br.com.ufal.gradua.models.agenda.NotificationModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.NotificationRepository;
import br.com.ufal.gradua.repositories.UserRepository;

@Service
@Transactional
public class NotificationService {

    @Autowired
    NotificationRepository notificationRepository;

    @Autowired
    UserRepository userRepository;

    private UserModel getUserByToken() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserModel) authentication.getPrincipal();
    }

    private MonitorSessionResponseDTO sessionToDTO(MonitorSessionModel session) {
        if (session == null) return null;
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

    private NotificationResponseDTO toDTO(NotificationModel notif) {
        return new NotificationResponseDTO(
            notif.getNotificationId(),
            notif.getMessage(),
            notif.getIsRead(),
            notif.getCreatedAt(),
            sessionToDTO(notif.getMonitorSession())
        );
    }

    /** Retorna todas as notificações do usuário logado, mais recentes primeiro. */
    public List<NotificationResponseDTO> listMyNotifications() {
        UserModel user = getUserByToken();
        return notificationRepository.findByRecipientUserOrderByCreatedAtDesc(user)
            .stream().map(this::toDTO).collect(Collectors.toList());
    }

    /** Retorna contagem de notificações não lidas (usado pelo badge na Header). */
    public long countUnread() {
        UserModel user = getUserByToken();
        return notificationRepository.countByRecipientUserAndIsReadFalse(user);
    }

    /** Marca uma notificação como lida. Valida que pertence ao usuário logado. */
    public void markAsRead(UUID notificationId) {
        UserModel user = getUserByToken();
        NotificationModel notif = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notificação não encontrada."));

        if (!notif.getRecipientUser().getUserId().equals(user.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Sem permissão para marcar esta notificação.");
        }

        notif.setIsRead(true);
        notificationRepository.save(notif);
    }

    /**
     * Cria uma notificação de AVISO para todos os usuários cadastrados,
     * exceto o próprio autor do aviso.
     * Chamado pelo ForumTopicService ao criar tópico do tipo AVISO.
     *
     * @param authorId  UUID do monitor que publicou o aviso (excluído da lista)
     * @param message   Texto da notificação
     */
    public void broadcastAvisoNotification(UUID authorId, String message) {
        List<UserModel> allUsers = userRepository.findAll();
        LocalDateTime now = LocalDateTime.now(ZoneOffset.of("-3"));

        List<NotificationModel> notifications = allUsers.stream()
            .filter(u -> !u.getUserId().equals(authorId)) // não notifica o próprio autor
            .map(u -> {
                NotificationModel n = new NotificationModel();
                n.setRecipientUser(u);
                n.setMonitorSession(null); // aviso do fórum, sem sessão vinculada
                n.setMessage(message);
                n.setIsRead(false);
                n.setCreatedAt(now);
                return n;
            })
            .collect(Collectors.toList());

        notificationRepository.saveAll(notifications);
    }
}
