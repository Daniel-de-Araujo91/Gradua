package br.com.ufal.gradua.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.ufal.gradua.models.academic.ClassSectionModel;
import br.com.ufal.gradua.models.academic.EnrollmentModel;
import br.com.ufal.gradua.models.user.UserModel;

public interface EnrollmentRepository extends JpaRepository<EnrollmentModel, UUID> {

    /** Busca matrículas de uma turma. */
    List<EnrollmentModel> findByClassSection(ClassSectionModel classSection);

    /**
     * Retorna os UserModel de TODOS os alunos matriculados em uma turma.
     * Não filtra por status para evitar problemas com enum privado.
     * Usado pelo MonitorSessionService para disparar notificações em lote.
     */
    @Query("SELECT e.student.user FROM EnrollmentModel e WHERE e.classSection = :classSection")
    List<UserModel> findEnrolledUsersByClassSection(@Param("classSection") ClassSectionModel classSection);
}
