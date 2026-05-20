package br.com.ufal.gradua.models.agenda;

import java.util.UUID;

import br.com.ufal.gradua.models.auth.StudentModel;
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
public class SessionAttendanceModel{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID attendanceId;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private MonitoringSessionModel monitoringSession;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private StudentModel student;
}
