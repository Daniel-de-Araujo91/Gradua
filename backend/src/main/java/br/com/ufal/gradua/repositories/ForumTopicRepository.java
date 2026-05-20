package br.com.ufal.gradua.repositories;

import br.com.ufal.gradua.models.forum.ForumTopicModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ForumTopicRepository extends JpaRepository<ForumTopicModel, UUID> {}