package br.com.ufal.gradua.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.academic.EnrollmentModel;
import br.com.ufal.gradua.models.academic.GradeModel;

public interface GradeRepository extends JpaRepository<GradeModel, UUID> {
    List<GradeModel> findByEnrollment(EnrollmentModel enrollment);
    Optional<GradeModel> findByEnrollmentAndGradeType(EnrollmentModel enrollment, String gradeType);
    List<GradeModel> findByEnrollmentIn(List<EnrollmentModel> enrollments);
}
