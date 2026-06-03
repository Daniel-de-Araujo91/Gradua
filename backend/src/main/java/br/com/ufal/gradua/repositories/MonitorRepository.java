package br.com.ufal.gradua.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.auth.MonitorModel;
import br.com.ufal.gradua.models.auth.StudentModel;

public interface MonitorRepository extends JpaRepository<MonitorModel, UUID> {

    /** Busca o MonitorModel associado ao StudentModel do usuário logado. */
    Optional<MonitorModel> findByStudent(StudentModel student);
}
