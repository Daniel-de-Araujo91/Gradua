package br.com.ufal.gradua.models.academic;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.UUID;

import br.com.ufal.gradua.models.auth.StudentModel;
import br.com.ufal.gradua.models.institutional.SubjectModel;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "TB_RECORD")
public class AcademicRecordModel implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    private UUID recordId;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private StudentModel student;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private SubjectModel subject;

    private String completionTerm;

    private BigDecimal finalGrade;

    @Enumerated(EnumType.STRING)
    private Status status;
    
    private enum Status{
        PASSED, FAILED, AVERAGE
    }

}
