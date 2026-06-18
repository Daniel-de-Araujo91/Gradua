package br.com.ufal.gradua.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.forum.ForumTopicModel;
import br.com.ufal.gradua.models.forum.ForumVoteModel;
import br.com.ufal.gradua.models.user.UserModel;

public interface ForumVoteRepository extends JpaRepository<ForumVoteModel, UUID> {
    Optional<ForumVoteModel> findByTopicAndAuthor(ForumTopicModel topic, UserModel author);

    long countByTopicAndVoteType(ForumTopicModel topic, ForumVoteModel.VoteType voteType);
}
