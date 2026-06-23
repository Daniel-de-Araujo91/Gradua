package br.com.ufal.gradua.models.forum;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

import br.com.ufal.gradua.models.user.UserModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "TB_FORUM_REPORT")
public class ForumReportModel implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID reportId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = true)
    private ForumTopicModel topic;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id", nullable = true)
    private ForumCommentModel comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private UserModel author;

    @Column(columnDefinition = "TEXT")
    private String reason;

    private LocalDateTime creationDate;

    public enum ReportType {
        TOPIC, COMMENT
    }

    private ReportType reportType;
}