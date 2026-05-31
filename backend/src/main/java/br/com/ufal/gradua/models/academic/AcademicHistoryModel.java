package br.com.ufal.gradua.models.academic;

import java.io.Serializable;
import java.util.List;
import java.util.UUID;


import br.com.ufal.gradua.models.auth.StudentModel;
import br.com.ufal.gradua.models.institutional.SubjectModel;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
@Table(name = "TB_HISTORY")
public class AcademicHistoryModel implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID historyId;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private StudentModel student;

    @OneToMany
    @JoinColumn(name = "subject_id")
    private List<AcademicRecordModel> subjectConcluded;

    @OneToMany
    @JoinColumn(name = "subject_id")
    private List<EnrollmentModel> currentSubject;
}
