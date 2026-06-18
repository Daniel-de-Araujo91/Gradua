package br.com.ufal.gradua.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.agenda.MonitorSessionModel;
import br.com.ufal.gradua.models.auth.MonitorModel;
import br.com.ufal.gradua.models.academic.ClassSectionModel;

public interface MonitorSessionRepository extends JpaRepository<MonitorSessionModel, UUID> {

    @EntityGraph(attributePaths = {
            "classSection",
            "classSection.subject"
    })
    List<MonitorSessionModel> findByMonitorOrderByDateAscStartTimeAsc(MonitorModel monitor);

    @EntityGraph(attributePaths = {
            "monitor",
            "monitor.student",
            "monitor.student.user"
    })
    List<MonitorSessionModel> findByClassSectionOrderByDateAscStartTimeAsc(ClassSectionModel classSection);

    @EntityGraph(attributePaths = {
            "classSection",
            "classSection.subject",
            "monitor",
            "monitor.student",
            "monitor.student.user"
    })
    List<MonitorSessionModel> findByClassSectionInAndDateOrderByStartTimeAsc(
            List<ClassSectionModel> classSections,
            LocalDate date
    );
}