package br.com.ufal.gradua.models.forum;


import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

import br.com.ufal.gradua.models.user.UserModel;

@Getter
@Setter
@Entity
@Table(name = "forum_topics")
public class ForumTopicModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID topicId;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private UserModel author;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private Boolean isLockedByMod = false;

    @Column(nullable = false)
    private LocalDateTime creationDate = LocalDateTime.now();
    
}