package br.com.ufal.gradua.models.user;

import java.io.Serializable;
import java.util.UUID;

import br.com.ufal.gradua.models.auth.ProfessorModel;
import br.com.ufal.gradua.models.auth.StudentModel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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

    @OneToOne
    @JoinColumn(name = "student_id")
    private StudentModel student;

    @OneToOne
    @JoinColumn(name = "professor_id")
    private ProfessorModel professor;

}
