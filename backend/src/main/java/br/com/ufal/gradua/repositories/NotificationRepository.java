package br.com.ufal.gradua.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.agenda.NotificationModel;
import br.com.ufal.gradua.models.user.UserModel;

public interface NotificationRepository extends JpaRepository<NotificationModel, UUID> {

    @EntityGraph(attributePaths = {
            "monitorSession",
            "monitorSession.monitor.student.user",
            "monitorSession.classSection.subject"
    })
    List<NotificationModel> findByRecipientUserOrderByCreatedAtDesc(UserModel recipientUser);

    @EntityGraph(attributePaths = {         
            "monitorSession",
            "monitorSession.monitor.student.user",
            "monitorSession.classSection.subject"
    })
    List<NotificationModel> findByRecipientUserAndIsReadFalse(UserModel recipientUser);

    long countByRecipientUserAndIsReadFalse(UserModel recipientUser);
}