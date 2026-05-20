package br.com.ufal.gradua.models.institutional;


import java.util.UUID;

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
public class CurriculumMatrixModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID gridId;

    @ManyToOne
    @JoinColumn(name = "curriculum_id", nullable = false)
    private CurriculumModel curriculum;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private SubjectModel subject;

     @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubjectType subjectType;

    private Integer idealSemester;

    public enum SubjectType {
        MANDATORY, ELECTIVE
    }
}
