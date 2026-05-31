package br.com.ufal.gradua.services.forum;

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
import br.com.ufal.gradua.dtos.forum.ForumTopicRequestDTO;
import br.com.ufal.gradua.dtos.forum.ForumTopicResponseDTO;
import br.com.ufal.gradua.models.forum.ForumCommentModel;
import br.com.ufal.gradua.models.forum.ForumTopicModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.forum.ForumCommentRepository;
import br.com.ufal.gradua.repositories.forum.ForumTopicRepository;
import jakarta.validation.Valid;

@Service
@Transactional
public class ForumCommentService {

    @Autowired
    ForumCommentRepository repository;

    @Autowired
    ForumTopicRepository forumRepository;

    private UserModel getUserByToken() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserModel) authentication.getPrincipal();
    }

    private ForumCommentResponseDTO toDTO(ForumCommentModel topic) {
        return new ForumCommentResponseDTO(
            topic.getCommentId(),
            topic.getTopic().getTopicId(),
            topic.getContent(),
            topic.getAuthor().getFirstName()+" "+topic.getAuthor().getLastName(),
            topic.getCreationDate()
        );
    }

    public ForumCommentResponseDTO create(ForumCommentRequestDTO dto, UUID forumTopicId) {
        UserModel author = getUserByToken();

        ForumTopicModel forumTopic = forumRepository.findById(forumTopicId) .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tópico não encontrado"));

        ForumCommentModel forumComment = new ForumCommentModel();
        forumComment.setTopic(forumTopic);
        forumComment.setContent(dto.content());
        forumComment.setAuthor(author);
        forumComment.setCreationDate(LocalDateTime.now(ZoneOffset.of("-3")));

        repository.save(forumComment);

        return toDTO(forumComment);
    }

    public List<ForumCommentResponseDTO> listAll(UUID forumTopicId) {
         ForumTopicModel forumTopic = forumRepository.findById(forumTopicId) .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tópico não encontrado"));


        List<ForumCommentModel> topics = repository.findByTopic(forumTopic);

        return topics.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ForumCommentResponseDTO update(UUID id, ForumCommentRequestDTO dto) {
        ForumCommentModel forumComment = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tópico não encontrado"));

        UserModel user = getUserByToken();

        if (!forumComment.getAuthor().getUserId().equals(user.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas o autor pode editar este tópico");
        }

        forumComment.setContent(dto.content());

        repository.save(forumComment);

        return toDTO(forumComment);
    }

    public void delete(UUID id) {
         ForumCommentModel forumComment = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tópico não encontrado"));

        UserModel user = getUserByToken();

        if (!forumComment.getAuthor().getUserId().equals(user.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas o autor pode excluir este tópico");
        }

        repository.delete(forumComment);
    }
}

