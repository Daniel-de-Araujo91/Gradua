package br.com.ufal.gradua.models.auth;

import java.io.Serializable;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
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
@Table(name = "TB_MONITOR")
public class MonitorModel implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    private UUID monitorId;

    private String scholarshipType;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "monitor_id")
    private StudentModel student;

}
