package br.com.ufal.gradua.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.forum.ForumTopicModel;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ForumTopicRepository extends JpaRepository<ForumTopicModel, UUID> {
    List<ForumTopicModel> findByType(String type);
    @Query("SELECT t FROM ForumTopicModel t JOIN FETCH t.author ORDER BY t.creationDate DESC")
    List<ForumTopicModel> findAllByOrderByCreationDateDesc();

    @Query("SELECT t FROM ForumTopicModel t JOIN FETCH t.author WHERE UPPER(t.type) = :type ORDER BY t.creationDate DESC")
    List<ForumTopicModel> findByTypeOrderByCreationDateDesc(@Param("type") String type);

    @Query("SELECT t FROM ForumTopicModel t JOIN FETCH t.author WHERE UPPER(t.type) IN :types ORDER BY t.creationDate DESC")
    List<ForumTopicModel> findByTypeInOrderByCreationDateDesc(@Param("types") List<String> types);

    @Query("SELECT t FROM ForumTopicModel t JOIN FETCH t.author WHERE t.hidden = true ORDER BY t.creationDate DESC")
    List<ForumTopicModel> findByHiddenTrueOrderByCreationDateDesc();
}
