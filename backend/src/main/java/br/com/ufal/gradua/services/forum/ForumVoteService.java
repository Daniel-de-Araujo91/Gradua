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

import br.com.ufal.gradua.dtos.forum.ForumVoteRequestDTO;
import br.com.ufal.gradua.dtos.forum.ForumVoteResponseDTO;
import br.com.ufal.gradua.dtos.forum.ForumTopicRequestDTO;
import br.com.ufal.gradua.dtos.forum.ForumTopicResponseDTO;
import br.com.ufal.gradua.models.forum.ForumVoteModel;
import br.com.ufal.gradua.models.forum.ForumTopicModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.forum.ForumVoteRepository;
import br.com.ufal.gradua.repositories.forum.ForumTopicRepository;
import jakarta.validation.Valid;

@Service
@Transactional
public class ForumVoteService {

    @Autowired
    ForumVoteRepository repository;

    @Autowired
    ForumTopicRepository forumRepository;

    private UserModel getUserByToken() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserModel) authentication.getPrincipal();
    }

    private ForumVoteResponseDTO toDTO(ForumVoteModel vote) {
        return new ForumVoteResponseDTO(
            vote.getVoteId(),
            vote.getTopic().getTopicId(),
            vote.getVoteType(),
            vote.getAuthor().getFirstName()+" "+vote.getAuthor().getLastName()
        );
    }

    public ForumVoteResponseDTO create(ForumVoteRequestDTO dto, UUID forumTopicId) {
        UserModel author = getUserByToken();

        ForumTopicModel forumTopic = forumRepository.findById(forumTopicId) .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tópico não encontrado"));

        ForumVoteModel forumVote = new ForumVoteModel();
        forumVote.setTopic(forumTopic);
        forumVote.setVoteType(dto.type());;
        forumVote.setAuthor(author);
       
        repository.save(forumVote);

        return toDTO(forumVote);
    }

    public Integer cont(UUID forumTopicId, ForumVoteRequestDTO dto) {
         ForumTopicModel forumTopic = forumRepository.findById(forumTopicId) .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tópico não encontrado"));


        List<ForumVoteModel> topics = repository.findByTopic(forumTopic);
        Integer cont = 0;
        for(ForumVoteModel vote : topics){
            if(vote.getVoteType().equals(dto.type())){
                cont++;
            }
        }

        return cont;
    }



    public void delete(UUID id) {
         ForumVoteModel forumVote = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tópico não encontrado"));

        UserModel user = getUserByToken();

        if (!forumVote.getAuthor().getUserId().equals(user.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas o autor pode excluir este tópico");
        }

        repository.delete(forumVote);
    }
}

