package br.com.ufal.gradua.models.forum;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

import br.com.ufal.gradua.models.institutional.ProgramModel;
import br.com.ufal.gradua.models.institutional.SubjectModel;
import br.com.ufal.gradua.models.user.UserModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.FetchType;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "TB_FORUM_TOPIC")
public class ForumTopicModel implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID topicId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private UserModel author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = true)
    private SubjectModel subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = true)
    private ProgramModel program;

    private String title;

    @Column(columnDefinition = "TEXT") 
    private String content;

    private Boolean isLockedByMod;

    private LocalDateTime creationDate;

    private String type;

    private Boolean isEdited = false;

    private Integer voteScore = 0;

    private Integer commentCount = 0;

    private Integer upVoteCount = 0;
    private Integer downVoteCount = 0;

    private Integer reportCount = 0;

    private Boolean hidden = false;

    private LocalDateTime hiddenAt;

    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ForumCommentModel> comments;

    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ForumVoteModel> votes;

    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ForumReportModel> reports;
}
