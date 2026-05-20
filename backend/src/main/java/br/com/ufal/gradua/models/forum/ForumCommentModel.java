package br.com.ufal.gradua.models.forum;

import java.time.LocalDateTime;
import java.util.UUID;

import br.com.ufal.gradua.models.user.UserModel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class ForumCommentModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID commentId;

    @ManyToOne
    @JoinColumn(name = "topic_id", nullable = false)
    private ForumTopicModel topic;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private UserModel author;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private LocalDateTime creationDate = LocalDateTime.now();
}