package br.com.ufal.gradua.models.institutional;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Entity
public class ProgramModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID programId;

    @Column(nullable = false)
    private String name;
}
