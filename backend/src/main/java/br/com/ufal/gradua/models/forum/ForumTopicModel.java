package br.com.ufal.gradua.models.forum;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;


import br.com.ufal.gradua.models.institutional.ProgramModel;
import br.com.ufal.gradua.models.institutional.SubjectModel;
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
@Table(name = "TB_FORUM_TOPIC")
public class ForumTopicModel implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID topicId;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private UserModel author;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = true)
    private SubjectModel subject;

    @ManyToOne
    @JoinColumn(name = "program_id", nullable = true)
    private ProgramModel program;

    private String title;

    @Lob 
    private String content;

    private Boolean isLockedByMod;

    private LocalDateTime creationDate;

    private String type;

    // Flag: indica se o tópico foi editado após criação (spec 2.2 - Edição no Fórum)
    private Boolean isEdited = false;

    // Contador agregado de votos (positivos - negativos), nulo para posts do tipo AVISO
    private Integer voteScore = 0;

    // Contador de comentários vinculados ao tópico
    private Integer commentCount = 0;

}
