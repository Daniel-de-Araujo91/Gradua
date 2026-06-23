package br.com.ufal.gradua.models.academic;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.UUID;


import br.com.ufal.gradua.models.auth.StudentModel;
import br.com.ufal.gradua.models.institutional.SubjectModel;
import jakarta.persistence.*;
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
@Table(name = "TB_HISTORY")
public class AcademicHistoryModel implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID historyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private StudentModel student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id")
    private SubjectModel subject;

    private String academicTerm;

    private BigDecimal finalGrade;

    private String status;

    private String professorName;

    private Integer frequency;

    private String subjectType;
}
