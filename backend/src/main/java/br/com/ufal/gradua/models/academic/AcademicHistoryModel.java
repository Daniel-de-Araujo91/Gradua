package br.com.ufal.gradua.models.academic;

import java.math.BigDecimal;
import java.util.UUID;

import br.com.ufal.gradua.models.institutional.SubjectModel;
import br.com.ufal.gradua.models.auth.StudentModel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class AcademicHistoryModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID recordId;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private StudentModel student;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private SubjectModel subject;

    @Column(nullable = false)
    private String completionTerm;

    @Column(nullable = false, precision = 4, scale = 2)
    private BigDecimal finalGrade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecordStatus status;

    public enum RecordStatus {
        PASSED, FAILED
    }
}