package br.com.ufal.gradua.models.auth;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.UUID;

import br.com.ufal.gradua.models.institutional.CurriculumModel;
import br.com.ufal.gradua.models.institutional.ProgramModel;
import br.com.ufal.gradua.models.user.UserModel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
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
@Table(name = "TB_STUDENT")
public class StudentModel implements Serializable{
    private static final long serialVersionUID = 1L;

    @Id
    private UUID studentID;

    @Column(name = "enrollment_number", unique = true)
    private String enrollmentNumber;

    private Integer currentTerm;

    @Column(name = "ira",precision = 4,scale = 2)
    private BigDecimal ira;

    private Integer mandatoryHours;
    private Integer electiveHours;
    private Integer complementaryHours;
    private Integer totalHours;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private UserModel user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id")
    private ProgramModel program;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curriculum_id")
    private CurriculumModel curriculum;
    

}
