package br.com.ufal.gradua.models.academic;

import java.io.Serializable;
import java.util.UUID;

import br.com.ufal.gradua.models.auth.StudentModel;
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
@Table(name = "TB_ENROLLMENT")
public class EnrollmentModel implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID enrollmentId;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private StudentModel student;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private ClassSectionModel classSection;

    @Enumerated(EnumType.STRING)
    private Status status;

    private Integer absences;

    private enum Status {
        ENROLLED, DROPPED
    }

}
