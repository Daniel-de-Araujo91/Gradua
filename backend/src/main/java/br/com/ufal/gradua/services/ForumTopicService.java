package br.com.ufal.gradua.services;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.ufal.gradua.dtos.forum.ForumTopicRequestDTO;
import br.com.ufal.gradua.dtos.forum.ForumTopicResponseDTO;
import br.com.ufal.gradua.models.forum.ForumTopicModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.ForumTopicRepository;

@Service
@Transactional
public class ForumTopicService {

    @Autowired
    ForumTopicRepository repository;

    /** Injeção via setter para evitar dependência circular */
    @Autowired
    private NotificationService notificationService;

    private UserModel getUserByToken() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserModel) authentication.getPrincipal();
    }

    private ForumTopicResponseDTO toDTO(ForumTopicModel topic) {
        return new ForumTopicResponseDTO(
            topic.getTopicId(),
            topic.getTitle(),
            topic.getContent(),
            topic.getAuthor().getFirstName() + " " + topic.getAuthor().getLastName(),
            topic.getAuthor().getUserId(),
            topic.getType(),
            topic.getCreationDate(),
            topic.getIsEdited() != null ? topic.getIsEdited() : false,
            topic.getVoteScore() != null ? topic.getVoteScore() : 0,
            topic.getCommentCount() != null ? topic.getCommentCount() : 0
        );
    }

    public ForumTopicResponseDTO create(ForumTopicRequestDTO dto) {
        UserModel author = getUserByToken();

        // Spec 1.2 / Fase 4: apenas monitores, admins e professores podem criar posts do tipo AVISO
        if ("AVISO".equalsIgnoreCase(dto.type()) && 
            !("MONITOR".equalsIgnoreCase(author.getRole()) || "ADMIN".equalsIgnoreCase(author.getRole()) || "PROFESSOR".equalsIgnoreCase(author.getRole()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "Apenas monitores, professores ou administradores podem publicar avisos.");
        }

        ForumTopicModel forumTopic = new ForumTopicModel();
        forumTopic.setTitle(dto.title());
        forumTopic.setContent(dto.content());
        forumTopic.setType(dto.type());
        forumTopic.setAuthor(author);
        forumTopic.setIsLockedByMod(false);
        forumTopic.setIsEdited(false);
        forumTopic.setVoteScore(0);
        forumTopic.setCommentCount(0);
        forumTopic.setCreationDate(LocalDateTime.now(ZoneOffset.of("-3")));

        repository.save(forumTopic);

        // Spec 1.2: ao publicar AVISO, notificar TODOS os usuários cadastrados
        if ("aviso".equalsIgnoreCase(dto.type())) {
            String authorName = author.getFirstName() + " " + author.getLastName();
            String message = String.format("📢 Novo aviso de %s: \"%s\"",
                authorName, dto.title());
            notificationService.broadcastAvisoNotification(author.getUserId(), message);
        }

        return toDTO(forumTopic);
    }

    public List<ForumTopicResponseDTO> listAll(String type) {
        List<ForumTopicModel> topics = (type != null && !type.isBlank())
            ? repository.findByTypeOrderByCreationDateDesc(type)
            : repository.findAllByOrderByCreationDateDesc();

        return topics.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ForumTopicResponseDTO update(UUID id, ForumTopicRequestDTO dto) {
        ForumTopicModel forumTopic = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tópico não encontrado"));

        UserModel user = getUserByToken();

        // Spec 4.3: verificação de autoria antes de habilitar edição
        if (!forumTopic.getAuthor().getUserId().equals(user.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas o autor pode editar este tópico");
        }

        forumTopic.setTitle(dto.title());
        forumTopic.setContent(dto.content());
        forumTopic.setType(dto.type());
        // Spec 2.2: ativar marcador lógico de modificação
        forumTopic.setIsEdited(true);

        repository.save(forumTopic);

        return toDTO(forumTopic);
    }

    public void delete(UUID id) {
        ForumTopicModel forumTopic = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tópico não encontrado"));

        UserModel user = getUserByToken();

        if (!forumTopic.getAuthor().getUserId().equals(user.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas o autor pode excluir este tópico");
        }

        repository.delete(forumTopic);
    }
}
