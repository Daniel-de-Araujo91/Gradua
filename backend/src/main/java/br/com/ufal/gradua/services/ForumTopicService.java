package br.com.ufal.gradua.Services;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.ufal.gradua.dtos.forum.ForumTopicRequestDTO;
import br.com.ufal.gradua.dtos.forum.ForumTopicResponseDTO;
import br.com.ufal.gradua.models.forum.ForumTopicModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.ForumTopicRepository;

@Service
public class ForumTopicService {

    @Autowired
    ForumTopicRepository repository;

    private UserModel getUserbyToken(){
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserModel) authentication.getPrincipal();
    }


    public ForumTopicResponseDTO create(ForumTopicRequestDTO dto){
        UserModel author = getUserbyToken();

        ForumTopicModel forumTopic = new ForumTopicModel();
        forumTopic.setTitle(dto.title());
        forumTopic.setContent(dto.content());
        forumTopic.setType(dto.type());
        forumTopic.setAuthor(author);
        forumTopic.setIsLockedByMod(false);
        forumTopic.setCreationDate(LocalDateTime.now(ZoneOffset.of("-3")));

        repository.save(forumTopic);

        return new ForumTopicResponseDTO(forumTopic.getTopicId(),forumTopic.getTitle(),forumTopic.getContent(), author.getFirstName() +" "+ author.getLastName(), forumTopic.getType(), forumTopic.getCreationDate());
    }

    public List<ForumTopicResponseDTO> listAll(){
        return repository.findAll().stream().map(forumTopic -> new ForumTopicResponseDTO(forumTopic.getTopicId(),forumTopic.getTitle(),forumTopic.getContent(),forumTopic.getAuthor().getFirstName() +" "+ forumTopic.getAuthor().getLastName(), forumTopic.getType(), forumTopic.getCreationDate())).collect(Collectors.toList());   
    }

    public ForumTopicResponseDTO update(UUID id, ForumTopicRequestDTO dto){
        ForumTopicModel forumTopic = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Forum not Found"));

        UserModel user = getUserbyToken();

        if(!forumTopic.getAuthor().getUserId().equals(user.getUserId())){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not Author");
        }

        forumTopic.setTitle(dto.title());
        forumTopic.setContent(dto.content());
        forumTopic.setType(dto.type());

        return new ForumTopicResponseDTO(forumTopic.getTopicId(),forumTopic.getTitle(),forumTopic.getContent(),forumTopic.getAuthor().getFirstName() +" "+ forumTopic.getAuthor().getLastName(), forumTopic.getType(), forumTopic.getCreationDate());
    }

    public void delete (UUID id){
        ForumTopicModel forumTopic = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Forum not Found"));

        UserModel user = getUserbyToken();

        if(!forumTopic.getAuthor().getUserId().equals(user.getUserId())){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not Author");
        }

        repository.delete(forumTopic);
    }


}
