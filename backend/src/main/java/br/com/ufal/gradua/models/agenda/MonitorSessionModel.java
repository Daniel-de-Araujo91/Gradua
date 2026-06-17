package br.com.ufal.gradua.models.agenda;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;
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
@Table(name = "TB_MONITOR_SESSION")
public class MonitorSessionModel implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID sessionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "monitor_id")
    private MonitorModel monitor;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private ClassSectionModel classSection;

    private String topic;

    private LocalDate date;

    // Horário de início da sessão (spec 4.2 - obrigatório)
    private LocalTime startTime;

    // Horário de término da sessão (spec 4.2 - obrigatório)
    private LocalTime endTime;

    @Column(nullable = true)
    private String location;

    // Link de videoconferência alternativo (spec 1.2 e 4.2)
    @Column(nullable = true)
    private String meetingLink;

}
