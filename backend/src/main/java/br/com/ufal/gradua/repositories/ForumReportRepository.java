package br.com.ufal.gradua.repositories;

import br.com.ufal.gradua.models.forum.ForumReportModel;
import br.com.ufal.gradua.models.forum.ForumTopicModel;
import br.com.ufal.gradua.models.forum.ForumCommentModel;
import br.com.ufal.gradua.models.user.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ForumReportRepository extends JpaRepository<ForumReportModel, UUID> {
    
    @Query("SELECT COUNT(r) FROM ForumReportModel r WHERE r.topic = :topic")
    long countByTopic(@Param("topic") ForumTopicModel topic);
    
    @Query("SELECT COUNT(r) FROM ForumReportModel r WHERE r.comment = :comment")
    long countByComment(@Param("comment") ForumCommentModel comment);
    
    boolean existsByTopicAndAuthor(ForumTopicModel topic, UserModel author);
    
    boolean existsByCommentAndAuthor(ForumCommentModel comment, UserModel author);

    java.util.List<ForumReportModel> findByTopic(ForumTopicModel topic);
}