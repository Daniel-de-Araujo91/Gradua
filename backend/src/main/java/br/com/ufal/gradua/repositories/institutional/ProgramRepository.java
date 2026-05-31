package br.com.ufal.gradua.repositories.institutional;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.institutional.ProgramModel;
import java.util.List;


public interface ProgramRepository extends JpaRepository<ProgramModel, UUID>{

    ProgramModel findByName(String name);
} 
