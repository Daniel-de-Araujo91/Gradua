package br.com.ufal.gradua.models.forum;

import java.util.UUID;

import br.com.ufal.gradua.models.user.UserModel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "topic_id"})
})
public class ForumVoteModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID voteId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserModel user;

    @ManyToOne
    @JoinColumn(name = "topic_id", nullable = false)
    private ForumTopicModel topic;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VoteType voteType;

    public enum VoteType {
        UP, DOWN
    }
}