package br.com.ufal.gradua.services;

import br.com.ufal.gradua.dtos.ForumTopicRequestDTO;
import br.com.ufal.gradua.dtos.ForumTopicResponseDTO;
import br.com.ufal.gradua.models.forum.ForumTopicModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.ForumTopicRepository;
import br.com.ufal.gradua.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ForumTopicService {
    private final ForumTopicRepository topicRepository;
    private final UserRepository userRepository;
    
    public ForumTopicResponseDTO createTopic(ForumTopicRequestDTO request) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserModel author = (UserModel) userRepository.findByCpfOrPassport(userDetails.getUsername(), userDetails.getUsername());

        ForumTopicModel topic = new ForumTopicModel();
        topic.setAuthor(author);
        topic.setContent(request.content());
        
        ForumTopicModel savedTopic = topicRepository.save(topic);
        return convertToResponseDTO(savedTopic);
    }

    public List<ForumTopicResponseDTO> findAllTopics() {
        return topicRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    private ForumTopicResponseDTO convertToResponseDTO(ForumTopicModel topic) {
        return new ForumTopicResponseDTO(
            topic.getTopicId(),
            topic.getAuthor().getUserId(), 
            topic.getTitle(),
            topic.getContent(),
            topic.getIsLockedByMod(),
            topic.getCreationDate()
        );
    }

    private UserModel getLoggedUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return (UserModel) userRepository.findByCpfOrPassport(userDetails.getUsername(), userDetails.getUsername());
    }

    public ForumTopicResponseDTO updateTopic(UUID topicId, ForumTopicRequestDTO request) {
        UserModel loggedUser = getLoggedUser();
        ForumTopicModel topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Tópico não encontrado"));

        if (!topic.getAuthor().getUserId().equals(loggedUser.getUserId())) {
            throw new RuntimeException("Você não tem permissão para editar este tópico.");
        }

        topic.setTitle(request.title());
        topic.setContent(request.content());

        return convertToResponseDTO(topicRepository.save(topic));
    }


    public void deleteTopic(UUID topicId) {
        UserModel loggedUser = getLoggedUser();
        ForumTopicModel topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Tópico não encontrado"));

        if (!topic.getAuthor().getUserId().equals(loggedUser.getUserId())) {
            throw new RuntimeException("Você não tem permissão para deletar este tópico.");
        }

        topicRepository.delete(topic);
    }
}