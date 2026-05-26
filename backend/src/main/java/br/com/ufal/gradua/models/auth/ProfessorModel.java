package br.com.ufal.gradua.models.auth;

import java.io.Serializable;
import java.util.UUID;

import br.com.ufal.gradua.models.user.UserModel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "TB_PROFESSOR")
public class ProfessorModel implements Serializable{
    private static final long serialVersionUID = 1L;

    @Id
    private UUID professorID;

    private String department;

    @Enumerated(EnumType.STRING)
    @Column(name = "registration_status")
    private RegistrationStatus registrationStatus;

    private enum RegistrationStatus{
        PENDING, APPROVED, REJECTED
    }

    @OneToOne
    @JoinColumn(name = "professor_id")
    private UserModel user;
}
