package br.com.ufal.gradua.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.ufal.gradua.models.forum.ForumCommentModel;
import br.com.ufal.gradua.models.forum.ForumTopicModel;

public interface ForumCommentRepository extends JpaRepository<ForumCommentModel, UUID> {

    @Query("SELECT c FROM ForumCommentModel c JOIN FETCH c.author WHERE c.topic = :topic ORDER BY c.creationDate ASC")
    List<ForumCommentModel> findByTopicOrderByCreationDateAsc(@Param("topic") ForumTopicModel topic);

    long countByTopic(ForumTopicModel topic);

    @EntityGraph(attributePaths = {"topic"})
    @Query("SELECT c FROM ForumCommentModel c WHERE c.commentId = :commentId")
    Optional<ForumCommentModel> findWithTopicById(@Param("commentId") UUID commentId);
}