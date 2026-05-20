package br.com.ufal.gradua.models.auth;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

import br.com.ufal.gradua.models.institutional.CurriculumModel;
import br.com.ufal.gradua.models.institutional.ProgramModel;
import br.com.ufal.gradua.models.user.UserModel;

@Getter
@Setter
@Entity
public class StudentModel{

    @Id
    private UUID studentId;

    @OneToOne
    @MapsId 
    @JoinColumn(name = "student_id")
    private UserModel user;

   @Column(nullable = false, unique = true)
    private String enrollmentNumber;

    @Column(nullable = false)
    private Integer currentTerm;

    @Column(precision = 4, scale = 2)
    private BigDecimal gpa;

    private int mandatoryHours;
    private int opitionalHours;
    private int supplementaryHours;
    private int totalHours;


    @ManyToOne
    @JoinColumn(name = "program_id", nullable = false)
    private ProgramModel program;

    @ManyToOne
    @JoinColumn(name = "curriculum_id", nullable = false)
    private CurriculumModel curriculum;




}
