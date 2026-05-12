package br.com.ufal.gradua.models;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = "TB_USER")
@Inheritance(strategy = InheritanceType.JOINED)
public class UserModel implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID idUser;
    private String firstName;
    private String lastName;
    @Column(name = "email", unique = true, nullable = false)
    private String email;
    private String passwordHash;
    private boolean isForeigner;
    @Column(name = "cpf", unique = true, nullable = true,  length = 14)
    private String cpf;
    @Column(name = "passport", unique = true, nullable = true, length = 50)
    private String passport;

    public UUID getIdUser() {
        return idUser;
    }

    public void setIdUser(UUID idUser) {
        this.idUser = idUser;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public boolean isForeigner() {
        return isForeigner;
    }

    public void setForeigner(boolean foreigner) {
        isForeigner = foreigner;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getPassport() {
        return passport;
    }

    public void setPassport(String passport) {
        this.passport = passport;
    }
}
