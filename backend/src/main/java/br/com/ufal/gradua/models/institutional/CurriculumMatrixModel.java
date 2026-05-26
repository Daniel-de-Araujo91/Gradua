package br.com.ufal.gradua.models.institutional;

import java.io.Serializable;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "TB_MATRIX")
public class CurriculumMatrixModel implements Serializable{
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID gridId;

    @ManyToOne
    @JoinColumn(name = "curriculum_id")
    private CurriculumModel curriculum;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private SubjectModel subject;

    @Enumerated(EnumType.STRING)
    private SubjectType subjectType;

    private Integer idealSemester; 

    private enum SubjectType{
        MANDATORY,ELECTIVE
    }

}
