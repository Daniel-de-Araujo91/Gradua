package br.com.ufal.gradua.repositories;

import br.com.ufal.gradua.models.StudentModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface StudentRepository extends JpaRepository<StudentModel, UUID> {
}
