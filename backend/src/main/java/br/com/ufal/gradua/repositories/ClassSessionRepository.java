package br.com.ufal.gradua.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.academic.ClassSectionModel;
import br.com.ufal.gradua.models.academic.ClassSessionModel;

public interface ClassSessionRepository extends JpaRepository<ClassSessionModel, UUID> {
    List<ClassSessionModel> findByClassSectionOrderByDateDesc(ClassSectionModel classSection);
    long countByClassSection(ClassSectionModel classSection);
}
