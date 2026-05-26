package br.com.ufal.gradua.models.auth;

import java.io.Serializable;
import java.util.UUID;

import br.com.ufal.gradua.models.institutional.ProgramModel;
import jakarta.persistence.Entity;
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
@Table(name = "TB_COORDINATOR")
public class CoordinatorModel implements Serializable{
    private static final long serialVersionUID = 1L;
    
    @Id
    private UUID coordinatorID;

    @OneToOne
    @JoinColumn(name = "program_id")
    private ProgramModel program;

    @OneToOne
    @JoinColumn(name = "coordinator_id" )
    private ProfessorModel professor;

}
