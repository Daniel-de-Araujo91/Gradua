package br.com.ufal.gradua.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.academic.AcademicHistoryModel;
import br.com.ufal.gradua.models.auth.StudentModel;

public interface AcademicHistoryRepository extends JpaRepository<AcademicHistoryModel, UUID> {
    List<AcademicHistoryModel> findByStudentOrderByAcademicTerm(StudentModel student);
}
