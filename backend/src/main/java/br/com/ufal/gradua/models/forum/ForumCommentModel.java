package br.com.ufal.gradua.models.forum;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;


import br.com.ufal.gradua.models.user.UserModel;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "TB_FORUM_COMMENT")
public class ForumCommentModel implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID commentId;

    @ManyToOne
    @JoinColumn(name = "topic_id", nullable = true)
    private ForumTopicModel topic;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private UserModel author;

    @Lob 
    private String content;

    private LocalDateTime creationDate;

    // Flag: indica se o comentário foi editado (spec 2.2)
    private Boolean isEdited = false;

    // Timestamp da última edição
    private LocalDateTime updatedAt;
}
