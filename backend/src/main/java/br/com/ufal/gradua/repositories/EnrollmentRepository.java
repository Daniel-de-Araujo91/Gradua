package br.com.ufal.gradua.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.ufal.gradua.models.academic.ClassSectionModel;
import br.com.ufal.gradua.models.academic.EnrollmentModel;
import br.com.ufal.gradua.models.user.UserModel;

public interface EnrollmentRepository extends JpaRepository<EnrollmentModel, UUID> {

    List<EnrollmentModel> findByClassSection(ClassSectionModel classSection);

    @EntityGraph(attributePaths = {
            "classSection",
            "classSection.subject",
            "classSection.professor.user"
    })
    List<EnrollmentModel> findByStudent(br.com.ufal.gradua.models.auth.StudentModel student);

    @Query("SELECT e.student.user FROM EnrollmentModel e WHERE e.classSection = :classSection")
    List<UserModel> findEnrolledUsersByClassSection(@Param("classSection") ClassSectionModel classSection);

    int countByClassSection(ClassSectionModel classSection);
}
