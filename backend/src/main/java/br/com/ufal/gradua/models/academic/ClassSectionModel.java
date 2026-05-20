package br.com.ufal.gradua.models.academic;


import java.util.UUID;

import br.com.ufal.gradua.models.institutional.SubjectModel;
import br.com.ufal.gradua.models.auth.ProfessorModel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
public class ClassSectionModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID classId;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private SubjectModel subject;

    @ManyToOne
    @JoinColumn(name = "professor_id", nullable = false)
    private ProfessorModel professor;

    @Column(nullable = false)
    private String academicTerm;
}

