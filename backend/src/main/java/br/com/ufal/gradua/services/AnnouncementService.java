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
import br.com.ufal.gradua.models.institutional.ProgramModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.AnnouncementRepository;
import br.com.ufal.gradua.repositories.ClassSectionRepository;
import br.com.ufal.gradua.repositories.EnrollmentRepository;
import br.com.ufal.gradua.repositories.NotificationRepository;
import br.com.ufal.gradua.repositories.ProgramRepository;
import br.com.ufal.gradua.repositories.StudentRepository;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final ClassSectionRepository classSectionRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final NotificationRepository notificationRepository;
    private final ProgramRepository programRepository;
    private final StudentRepository studentRepository;

    private UserModel getUserByToken() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserModel) authentication.getPrincipal();
    }

    public AnnouncementResponseDTO create(AnnouncementRequestDTO dto) {
        UserModel author = getUserByToken();
        String role = author.getRole() != null ? author.getRole().toUpperCase() : "";

        if (!"PROFESSOR".equals(role) && !"ADMIN".equals(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "Apenas professores e administradores podem criar comunicados.");
        }

        if (dto.classId() == null && dto.programId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "É necessário selecionar uma turma ou um curso para o comunicado.");
        }

        boolean isAdmin = "ADMIN".equals(role);
        AnnouncementModel announcement = new AnnouncementModel();
        announcement.setAuthor(author);
        announcement.setTitle(dto.title());
        announcement.setContent(dto.content());
        announcement.setPublishDate(LocalDateTime.now(ZoneOffset.of("-3")));

        String targetInfo;
        String targetName;
        List<UserModel> recipients = new ArrayList<>();

        if (dto.programId() != null) {
            if (!isAdmin) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Apenas administradores podem enviar comunicados para um curso inteiro.");
            }

            ProgramModel program = programRepository.findById(dto.programId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Curso não encontrado"));

            announcement.setProgram(program);
            targetInfo = program.getName();
            targetName = program.getName();
            recipients = studentRepository.findUsersByProgramId(program.getProgramId());

            announcementRepository.save(announcement);

            for (UserModel recipient : recipients) {
                if (recipient.getUserId().equals(author.getUserId())) continue;

                NotificationModel notification = new NotificationModel();
                notification.setRecipientUser(recipient);
                notification.setMessage("📢 Comunicado da coordenação (" + targetInfo + "): " + dto.title());
                notification.setIsRead(false);
                notification.setCreatedAt(LocalDateTime.now(ZoneOffset.of("-3")));
                notificationRepository.save(notification);
            }

            return new AnnouncementResponseDTO(
                announcement.getAnnoucementId(),
                announcement.getTitle(),
                announcement.getContent(),
                author.getFirstName() + " " + author.getLastName(),
                targetName,
                null,
                program.getProgramId(),
                program.getName(),
                announcement.getPublishDate()
            );
        }

        if (dto.classId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "É necessário selecionar uma turma para o comunicado.");
        }

        ClassSectionModel classSection = classSectionRepository.findById(dto.classId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Turma não encontrada"));

        if (!isAdmin && !classSection.getProfessor().getUser().getUserId().equals(author.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "Você só pode enviar comunicados para suas próprias turmas.");
        }

        announcement.setClassSection(classSection);
        announcementRepository.save(announcement);

        targetInfo = classSection.getSubject() != null
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
            null,
            null,
            announcement.getPublishDate()
        );
    }

    public List<AnnouncementResponseDTO> listMyClassAnnouncements() {
        UserModel user = getUserByToken();
        String role = user.getRole() != null ? user.getRole().toUpperCase() : "";

        List<ClassSectionModel> myClasses;
        if ("PROFESSOR".equals(role)) {
            myClasses = classSectionRepository.findByProfessor_User_UserId(user.getUserId());
        } else {
            myClasses = List.of();
        }

        List<AnnouncementModel> announcements = announcementRepository.findAllByOrderByPublishDateDesc();

        List<AnnouncementResponseDTO> result = new ArrayList<>();

        if (!myClasses.isEmpty()) {
            result.addAll(announcements.stream()
                .filter(a -> a.getClassSection() != null
                    && myClasses.stream().anyMatch(c -> c.getClassId().equals(a.getClassSection().getClassId())))
                .map(a -> {
                    String subjectName = a.getClassSection().getSubject() != null
                        ? a.getClassSection().getSubject().getName() : "-";
                    return new AnnouncementResponseDTO(
                        a.getAnnoucementId(), a.getTitle(), a.getContent(),
                        a.getAuthor().getFirstName() + " " + a.getAuthor().getLastName(),
                        subjectName, a.getClassSection().getClassId(),
                        a.getProgram() != null ? a.getProgram().getProgramId() : null,
                        a.getProgram() != null ? a.getProgram().getName() : null,
                        a.getPublishDate()
                    );
                })
                .collect(Collectors.toList()));
        }

        if ("ADMIN".equals(role)) {
            result.addAll(announcements.stream()
                .filter(a -> a.getProgram() != null)
                .map(a -> new AnnouncementResponseDTO(
                    a.getAnnoucementId(), a.getTitle(), a.getContent(),
                    a.getAuthor().getFirstName() + " " + a.getAuthor().getLastName(),
                    a.getProgram() != null ? a.getProgram().getName() : "-",
                    null,
                    a.getProgram() != null ? a.getProgram().getProgramId() : null,
                    a.getProgram() != null ? a.getProgram().getName() : null,
                    a.getPublishDate()
                ))
                .collect(Collectors.toList()));
        }

        return result;
    }

    public List<AnnouncementResponseDTO> getAnnouncementsForStudent() {
        UserModel user = getUserByToken();

        var student = user.getStudent();
        if (student == null) return List.of();

        var enrollments = enrollmentRepository.findByStudent(student);

        List<ClassSectionModel> studentClasses = enrollments.stream()
            .map(e -> e.getClassSection())
            .collect(Collectors.toList());

        List<AnnouncementModel> announcements = announcementRepository.findAllByOrderByPublishDateDesc();

        List<AnnouncementResponseDTO> result = new ArrayList<>();

        if (!studentClasses.isEmpty()) {
            result.addAll(announcements.stream()
                .filter(a -> a.getClassSection() != null
                    && studentClasses.stream().anyMatch(c -> c.getClassId().equals(a.getClassSection().getClassId())))
                .map(a -> {
                    String subjectName = a.getClassSection().getSubject() != null
                        ? a.getClassSection().getSubject().getName() : "-";
                    return new AnnouncementResponseDTO(
                        a.getAnnoucementId(), a.getTitle(), a.getContent(),
                        a.getAuthor().getFirstName() + " " + a.getAuthor().getLastName(),
                        subjectName, a.getClassSection().getClassId(),
                        a.getProgram() != null ? a.getProgram().getProgramId() : null,
                        a.getProgram() != null ? a.getProgram().getName() : null,
                        a.getPublishDate()
                    );
                })
                .collect(Collectors.toList()));
        }

        if (student.getProgram() != null) {
            UUID programId = student.getProgram().getProgramId();
            result.addAll(announcements.stream()
                .filter(a -> a.getProgram() != null && a.getProgram().getProgramId().equals(programId))
                .map(a -> new AnnouncementResponseDTO(
                    a.getAnnoucementId(), a.getTitle(), a.getContent(),
                    a.getAuthor().getFirstName() + " " + a.getAuthor().getLastName(),
                    a.getProgram().getName(),
                    null,
                    a.getProgram().getProgramId(),
                    a.getProgram().getName(),
                    a.getPublishDate()
                ))
                .collect(Collectors.toList()));
        }

        return result;
    }

    public List<AnnouncementResponseDTO> listProgramAnnouncements() {
        UserModel user = getUserByToken();

        if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "Apenas administradores podem listar comunicados por curso.");
        }

        List<AnnouncementModel> announcements = announcementRepository.findAllByOrderByPublishDateDesc();
        return announcements.stream()
            .filter(a -> a.getProgram() != null)
            .map(a -> new AnnouncementResponseDTO(
                a.getAnnoucementId(), a.getTitle(), a.getContent(),
                a.getAuthor().getFirstName() + " " + a.getAuthor().getLastName(),
                a.getProgram().getName(),
                null,
                a.getProgram().getProgramId(),
                a.getProgram().getName(),
                a.getPublishDate()
            ))
            .collect(Collectors.toList());
    }

    public List<ProgramModel> listPrograms() {
        return programRepository.findAll();
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
