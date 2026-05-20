package br.com.ufal.gradua.models.agenda;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

import br.com.ufal.gradua.models.academic.ClassSectionModel;
import br.com.ufal.gradua.models.auth.MonitorModel;
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
public class MonitoringSessionModel implements Serializable{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID sessionId;

    @ManyToOne
    @JoinColumn(name = "monitor_id", nullable = false)
    private MonitorModel monitor;

    @ManyToOne
    @JoinColumn(name = "class_id", nullable = false)
    private ClassSectionModel classSection;

    @Column(nullable = false)
    private String topic;

    @Column(nullable = false)
    private LocalDateTime startTime;

    private String locationLink;
}