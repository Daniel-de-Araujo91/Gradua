package br.com.ufal.gradua.repositories.forum;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.forum.ForumCommentModel;
import br.com.ufal.gradua.models.forum.ForumTopicModel;

public interface ForumCommentRepository extends JpaRepository<ForumCommentModel, UUID> {
    List<ForumCommentModel> findByTopic(ForumTopicModel topic);
}
