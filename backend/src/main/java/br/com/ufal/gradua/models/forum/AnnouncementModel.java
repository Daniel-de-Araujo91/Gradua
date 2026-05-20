package br.com.ufal.gradua.models.forum;

import java.time.LocalDateTime;
import java.util.UUID;

import br.com.ufal.gradua.models.academic.ClassSectionModel;
import br.com.ufal.gradua.models.institutional.ProgramModel;
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
public class AnnouncementModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID announcementId;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private UserModel author;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private ClassSectionModel classSection;

    @ManyToOne
    @JoinColumn(name = "program_id")
    private ProgramModel program;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private LocalDateTime publishDate = LocalDateTime.now();
}
