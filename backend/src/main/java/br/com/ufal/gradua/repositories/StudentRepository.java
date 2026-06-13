package br.com.ufal.gradua.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.auth.StudentModel;

public interface StudentRepository extends JpaRepository<StudentModel, UUID> {
}
