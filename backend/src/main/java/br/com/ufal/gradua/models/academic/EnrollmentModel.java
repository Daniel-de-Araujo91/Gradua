package br.com.ufal.gradua.models.academic;


import java.util.UUID;

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
public class EnrollmentModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID enrollmentId;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private StudentModel student;

    @ManyToOne
    @JoinColumn(name = "class_id", nullable = false)
    private ClassSectionModel classSection;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EnrollmentStatus status;

    private Integer absences;

    public enum EnrollmentStatus {
        ENROLLED, DROPPED
    }
}