package br.com.ufal.gradua.models.agenda;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

import br.com.ufal.gradua.models.user.UserModel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.FetchType;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "TB_NOTIFICATION")
public class NotificationModel implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID notificationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_user_id")
    private UserModel recipientUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    private MonitorSessionModel monitorSession;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private Boolean isRead = false;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
