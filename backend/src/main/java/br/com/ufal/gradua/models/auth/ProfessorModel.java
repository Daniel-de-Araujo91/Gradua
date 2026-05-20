package br.com.ufal.gradua.models.auth;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;


import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

import br.com.ufal.gradua.models.user.UserModel;

@Getter
@Setter   
@Entity
public class ProfessorModel{

    @Id
    private UUID professorId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "professor_id")
    private UserModel user;

    @Column(nullable = false)
    private String department;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RegistrationStatus registrationStatus;

    public enum RegistrationStatus {
        PENDING, APPROVED, REJECTED
    }

}
