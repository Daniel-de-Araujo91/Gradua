package br.com.ufal.gradua.models.auth;

import java.util.UUID;

import br.com.ufal.gradua.models.institutional.ProgramModel;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter   
@Entity
public class CoordinatorModel{

    @Id
    private UUID coordinatorId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "coordinator_id")
    private ProfessorModel professor;

    @OneToOne
    @JoinColumn(name = "program_id", nullable = false, unique = true)
    private ProgramModel program;
}
