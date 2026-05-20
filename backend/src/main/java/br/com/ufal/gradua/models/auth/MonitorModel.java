package br.com.ufal.gradua.models.auth;

import java.util.UUID;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class MonitorModel{

   @Id
    private UUID monitorId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "monitor_id")
    private StudentModel student;

    @Column(nullable = false)
    private String scholarshipType;
}
