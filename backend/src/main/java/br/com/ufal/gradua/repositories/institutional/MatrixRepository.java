package br.com.ufal.gradua.repositories.institutional;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.institutional.CurriculumMatrixModel;


public interface MatrixRepository  extends JpaRepository<CurriculumMatrixModel, UUID>{
        
}
