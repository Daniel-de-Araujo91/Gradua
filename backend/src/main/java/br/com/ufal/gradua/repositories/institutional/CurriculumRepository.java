package br.com.ufal.gradua.repositories.institutional;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.institutional.CurriculumModel;
import br.com.ufal.gradua.models.institutional.ProgramModel;

import java.util.List;
import java.util.Optional;


public interface CurriculumRepository  extends JpaRepository<CurriculumModel, UUID>{

    List<CurriculumModel> findByProgram(ProgramModel program);

   CurriculumModel findByName(String name);
}
