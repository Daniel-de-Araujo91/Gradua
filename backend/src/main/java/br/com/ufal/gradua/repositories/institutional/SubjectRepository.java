package br.com.ufal.gradua.repositories.institutional;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.institutional.SubjectModel;
import java.util.List;


public interface SubjectRepository  extends JpaRepository<SubjectModel, UUID>{
    SubjectModel findByCode(String code);
}
