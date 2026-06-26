package br.com.ufal.gradua.models.user;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

import br.com.ufal.gradua.models.auth.ProfessorModel;
import br.com.ufal.gradua.models.auth.StudentModel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToOne;
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
@Table(name = "TB_USER")
public class UserModel implements Serializable{
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID userId;

    private String firstName;

    private String lastName;

    @Column(name = "email", unique = true)
    private String email;

    private String passwordHash;

    private Boolean isForeigner;

    @Column(name = "cpf", unique = true, nullable = true)
    private String cpf;

    @Column(name = "passport", unique = true, nullable = true)
    private String passport;

    @Column(nullable = false)
    private String role = "USER";

    @Lob
    @Column(name = "profile_photo")
    private String profilePhoto;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private StudentModel student;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professor_id")
    private ProfessorModel professor;

    private Integer redFlagCount = 0;

    private LocalDateTime restrictedUntil;

    private String restrictionType;

}
