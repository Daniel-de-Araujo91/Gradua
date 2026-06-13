package br.com.ufal.gradua.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.institutional.SubjectModel;

public interface SubjectRepository extends JpaRepository<SubjectModel, UUID> {
}
