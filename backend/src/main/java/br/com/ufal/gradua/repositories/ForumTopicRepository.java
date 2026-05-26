package br.com.ufal.gradua.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.forum.ForumTopicModel;
import java.util.List;


public interface ForumTopicRepository extends JpaRepository<ForumTopicModel, UUID> {
    List<ForumTopicModel> findByType(String type);
}
