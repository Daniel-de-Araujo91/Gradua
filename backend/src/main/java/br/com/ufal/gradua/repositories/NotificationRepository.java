package br.com.ufal.gradua.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.agenda.NotificationModel;
import br.com.ufal.gradua.models.user.UserModel;

public interface NotificationRepository extends JpaRepository<NotificationModel, UUID> {

    /** Todas as notificações do usuário, mais recentes primeiro. */
    List<NotificationModel> findByRecipientUserOrderByCreatedAtDesc(UserModel recipientUser);

    /** Apenas notificações não lidas do usuário. */
    List<NotificationModel> findByRecipientUserAndIsReadFalse(UserModel recipientUser);

    /** Contagem de notificações não lidas (para badge na interface). */
    long countByRecipientUserAndIsReadFalse(UserModel recipientUser);
}
