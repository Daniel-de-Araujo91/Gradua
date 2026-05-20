package br.com.ufal.gradua.models.institutional;


import java.util.UUID;

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
public class CurriculumModel{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID curriculumId;

    @ManyToOne
    @JoinColumn(name = "program_id", nullable = false)
    private ProgramModel program;

    @Column(nullable = false)
    private String effectiveYear;

    private Integer reqMandatoryHours;
    private Integer reqElectiveHours;
    private Integer reqExtraHours;
    private Integer reqTotalHours;
}