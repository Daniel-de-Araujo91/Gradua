package br.com.ufal.gradua.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.academic.ClassAttendanceModel;
import br.com.ufal.gradua.models.academic.ClassSessionModel;
import br.com.ufal.gradua.models.academic.EnrollmentModel;

public interface ClassAttendanceRepository extends JpaRepository<ClassAttendanceModel, UUID> {
    List<ClassAttendanceModel> findByClassSession(ClassSessionModel classSession);
    Optional<ClassAttendanceModel> findByClassSessionAndEnrollment(ClassSessionModel classSession, EnrollmentModel enrollment);
    long countByClassSessionAndPresentFalse(ClassSessionModel classSession);
    long countByEnrollmentAndPresentFalse(EnrollmentModel enrollment);
    long countByEnrollment(EnrollmentModel enrollment);
}
