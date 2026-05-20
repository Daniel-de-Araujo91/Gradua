package br.com.ufal.gradua.models.user;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import br.com.ufal.gradua.models.auth.ProfessorModel;
import br.com.ufal.gradua.models.auth.StudentModel;

@Getter
@Setter   
@Entity
@Table(name = "user_model")
public class UserModel implements UserDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID userId;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private Boolean isForeigner;

    @Column(unique = true)
    private String cpf;

    @Column(unique = true)
    private String passport;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private StudentModel student;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private ProfessorModel professor;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() { return this.passwordHash; }

    @Override
    public String getUsername() {
        return this.isForeigner ? this.passport : this.cpf;
    }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}