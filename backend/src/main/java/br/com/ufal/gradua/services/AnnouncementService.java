package br.com.ufal.gradua.services;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.ufal.gradua.dtos.AnnouncementRequestDTO;
import br.com.ufal.gradua.dtos.AnnouncementResponseDTO;
import br.com.ufal.gradua.models.academic.ClassSectionModel;
import br.com.ufal.gradua.models.agenda.NotificationModel;
import br.com.ufal.gradua.models.forum.AnnouncementModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.AnnouncementRepository;
import br.com.ufal.gradua.repositories.ClassSectionRepository;
import br.com.ufal.gradua.repositories.EnrollmentRepository;
import br.com.ufal.gradua.repositories.NotificationRepository;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final ClassSectionRepository classSectionRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final NotificationRepository notificationRepository;

    private UserModel getUserByToken() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserModel) authentication.getPrincipal();
    }

    public AnnouncementResponseDTO create(AnnouncementRequestDTO dto) {
        UserModel author = getUserByToken();

        if (!"PROFESSOR".equalsIgnoreCase(author.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "Apenas professores podem criar comunicados direcionados.");
        }

        if (dto.classId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "É necessário selecionar uma turma para o comunicado.");
        }

        ClassSectionModel classSection = classSectionRepository.findById(dto.classId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Turma não encontrada"));

        if (!classSection.getProfessor().getUser().getUserId().equals(author.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "Você só pode enviar comunicados para suas próprias turmas.");
        }

        AnnouncementModel announcement = new AnnouncementModel();
        announcement.setAuthor(author);
        announcement.setClassSection(classSection);
        announcement.setTitle(dto.title());
        announcement.setContent(dto.content());
        announcement.setPublishDate(LocalDateTime.now(ZoneOffset.of("-3")));

        announcementRepository.save(announcement);

        String targetInfo = classSection.getSubject() != null
            ? classSection.getSubject().getCode() + " - " + classSection.getSubject().getName()
            : classSection.getClassId().toString();

        List<UserModel> enrolledUsers = enrollmentRepository.findEnrolledUsersByClassSection(classSection);
        for (UserModel recipient : enrolledUsers) {
            if (recipient.getUserId().equals(author.getUserId())) continue;

            NotificationModel notification = new NotificationModel();
            notification.setRecipientUser(recipient);
            notification.setMessage("📢 Comunicado de " + author.getFirstName() + " " + author.getLastName()
                + " (" + targetInfo + "): " + dto.title());
            notification.setIsRead(false);
            notification.setCreatedAt(LocalDateTime.now(ZoneOffset.of("-3")));
            notificationRepository.save(notification);
        }

        String subjectName = classSection.getSubject() != null ? classSection.getSubject().getName() : "-";

        return new AnnouncementResponseDTO(
            announcement.getAnnoucementId(),
            announcement.getTitle(),
            announcement.getContent(),
            author.getFirstName() + " " + author.getLastName(),
            subjectName,
            classSection.getClassId(),
            announcement.getPublishDate()
        );
    }

    public List<AnnouncementResponseDTO> listMyClassAnnouncements() {
        UserModel user = getUserByToken();

        List<ClassSectionModel> myClasses;
        if ("PROFESSOR".equalsIgnoreCase(user.getRole())) {
            myClasses = classSectionRepository.findByProfessor_User_UserId(user.getUserId());
        } else {
            myClasses = List.of();
        }

        if (myClasses.isEmpty()) return List.of();

        List<AnnouncementModel> announcements = announcementRepository.findAllByOrderByPublishDateDesc();
        return announcements.stream()
            .filter(a -> a.getClassSection() != null
                && myClasses.stream().anyMatch(c -> c.getClassId().equals(a.getClassSection().getClassId())))
            .map(a -> {
                String subjectName = a.getClassSection().getSubject() != null
                    ? a.getClassSection().getSubject().getName() : "-";
                return new AnnouncementResponseDTO(
                    a.getAnnoucementId(), a.getTitle(), a.getContent(),
                    a.getAuthor().getFirstName() + " " + a.getAuthor().getLastName(),
                    subjectName, a.getClassSection().getClassId(), a.getPublishDate()
                );
            })
            .collect(Collectors.toList());
    }

    public List<AnnouncementResponseDTO> getAnnouncementsForStudent() {
        UserModel user = getUserByToken();

        var student = user.getStudent();
        if (student == null) return List.of();

        var enrollments = enrollmentRepository.findByStudent(student);

        List<ClassSectionModel> studentClasses = enrollments.stream()
            .map(e -> e.getClassSection())
            .collect(Collectors.toList());

        if (studentClasses.isEmpty()) return List.of();

        List<AnnouncementModel> announcements = announcementRepository.findAllByOrderByPublishDateDesc();
        return announcements.stream()
            .filter(a -> a.getClassSection() != null
                && studentClasses.stream().anyMatch(c -> c.getClassId().equals(a.getClassSection().getClassId())))
            .map(a -> {
                String subjectName = a.getClassSection().getSubject() != null
                    ? a.getClassSection().getSubject().getName() : "-";
                return new AnnouncementResponseDTO(
                    a.getAnnoucementId(), a.getTitle(), a.getContent(),
                    a.getAuthor().getFirstName() + " " + a.getAuthor().getLastName(),
                    subjectName, a.getClassSection().getClassId(), a.getPublishDate()
                );
            })
            .collect(Collectors.toList());
    }

    public void delete(UUID id) {
        UserModel user = getUserByToken();
        AnnouncementModel announcement = announcementRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comunicado não encontrado"));

        if (!announcement.getAuthor().getUserId().equals(user.getUserId())
            && !"ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Sem permissão para excluir este comunicado.");
        }

        announcementRepository.delete(announcement);
    }
}
