package br.com.ufal.gradua.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.forum.ForumCommentModel;
import br.com.ufal.gradua.models.forum.ForumTopicModel;

public interface ForumCommentRepository extends JpaRepository<ForumCommentModel, UUID> {

    /** Comentários de um tópico, ordenados cronologicamente (mais antigos primeiro). */
    List<ForumCommentModel> findByTopicOrderByCreationDateAsc(ForumTopicModel topic);

    /** Contagem de comentários de um tópico. */
    long countByTopic(ForumTopicModel topic);
}
