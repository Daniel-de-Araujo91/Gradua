package br.com.ufal.gradua.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.institutional.ProgramModel;

public interface ProgramRepository extends JpaRepository<ProgramModel, UUID> {
}
