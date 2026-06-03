package br.com.ufal.gradua.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.agenda.MonitorSessionModel;
import br.com.ufal.gradua.models.auth.MonitorModel;
import br.com.ufal.gradua.models.academic.ClassSectionModel;

public interface MonitorSessionRepository extends JpaRepository<MonitorSessionModel, UUID> {

    /** Sessões de um monitor específico, ordenadas por data mais próxima. */
    List<MonitorSessionModel> findByMonitorOrderByDateAscStartTimeAsc(MonitorModel monitor);

    /** Sessões de uma turma/disciplina específica. */
    List<MonitorSessionModel> findByClassSectionOrderByDateAscStartTimeAsc(ClassSectionModel classSection);
}
