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

import br.com.ufal.gradua.dtos.forum.ForumCommentRequestDTO;
import br.com.ufal.gradua.dtos.forum.ForumCommentResponseDTO;
import br.com.ufal.gradua.models.forum.ForumCommentModel;
import br.com.ufal.gradua.models.forum.ForumTopicModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.ForumCommentRepository;
import br.com.ufal.gradua.repositories.ForumTopicRepository;

@Service
@Transactional
public class ForumCommentService {

    @Autowired
    ForumCommentRepository commentRepository;

    @Autowired
    ForumTopicRepository topicRepository;

    private UserModel getUserByToken() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserModel) authentication.getPrincipal();
    }

    private ForumCommentResponseDTO toDTO(ForumCommentModel comment) {
        return new ForumCommentResponseDTO(
            comment.getCommentId(),
            comment.getContent(),
            comment.getAuthor().getFirstName() + " " + comment.getAuthor().getLastName(),
            comment.getAuthor().getUserId(),
            comment.getCreationDate(),
            comment.getIsEdited() != null ? comment.getIsEdited() : false,
            comment.getUpdatedAt()
        );
    }

    public List<ForumCommentResponseDTO> listByTopic(UUID topicId) {
        ForumTopicModel topic = topicRepository.findById(topicId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tópico não encontrado"));

        return commentRepository.findByTopicOrderByCreationDateAsc(topic)
            .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ForumCommentResponseDTO create(UUID topicId, ForumCommentRequestDTO dto) {
        UserModel author = getUserByToken();
        ForumTopicModel topic = topicRepository.findById(topicId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tópico não encontrado"));

        ForumCommentModel comment = new ForumCommentModel();
        comment.setTopic(topic);
        comment.setAuthor(author);
        comment.setContent(dto.content());
        comment.setIsEdited(false);
        comment.setCreationDate(LocalDateTime.now(ZoneOffset.of("-3")));

        commentRepository.save(comment);

        // Incrementar contador de comentários no tópico
        topic.setCommentCount((topic.getCommentCount() != null ? topic.getCommentCount() : 0) + 1);
        topicRepository.save(topic);

        return toDTO(comment);
    }

    public ForumCommentResponseDTO update(UUID commentId, ForumCommentRequestDTO dto) {
        ForumCommentModel comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comentário não encontrado"));

        UserModel user = getUserByToken();

        // Spec 4.3: verificar autoria antes de habilitar edição
        if (!comment.getAuthor().getUserId().equals(user.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas o autor pode editar este comentário");
        }

        comment.setContent(dto.content());
        // Spec 2.2: ativar marcador lógico de modificação
        comment.setIsEdited(true);
        comment.setUpdatedAt(LocalDateTime.now(ZoneOffset.of("-3")));

        commentRepository.save(comment);
        return toDTO(comment);
    }

    public void delete(UUID commentId) {
        // Agora buscamos o comentário E o tópico associado de uma só vez
        ForumCommentModel comment = commentRepository.findWithTopicById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comentário não encontrado"));

        UserModel user = getUserByToken();

        if (!comment.getAuthor().getUserId().equals(user.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas o autor pode excluir este comentário");
        }

        // Agora o 'topic' já está na memória e carregado pelo @EntityGraph
        ForumTopicModel topic = comment.getTopic();
        if (topic != null && topic.getCommentCount() != null && topic.getCommentCount() > 0) {
            topic.setCommentCount(topic.getCommentCount() - 1);
            topicRepository.save(topic);
        }

        commentRepository.delete(comment);
    }
}
