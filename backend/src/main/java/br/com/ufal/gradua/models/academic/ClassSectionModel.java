package br.com.ufal.gradua.models.academic;

import java.io.Serializable;
import java.util.UUID;

import br.com.ufal.gradua.models.auth.ProfessorModel;
import br.com.ufal.gradua.models.institutional.SubjectModel;
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

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "TB_CLASS")
public class ClassSectionModel implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID classId;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private SubjectModel subject;

    @ManyToOne
    @JoinColumn(name = "professor_id")
    private ProfessorModel professor;

    private String academicTerm;
    


}
