package br.com.ufal.gradua.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.academic.ClassSectionModel;

public interface ClassSectionRepository extends JpaRepository<ClassSectionModel, UUID> {
    List<ClassSectionModel> findByProfessor_User_UserId(UUID userId);
}
