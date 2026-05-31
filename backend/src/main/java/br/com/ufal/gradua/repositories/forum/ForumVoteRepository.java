package br.com.ufal.gradua.repositories.forum;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.forum.ForumTopicModel;
import br.com.ufal.gradua.models.forum.ForumVoteModel;
import java.util.List;


public interface ForumVoteRepository extends JpaRepository<ForumVoteModel, UUID>{
    List<ForumVoteModel> findByTopic(ForumTopicModel topic);

}
