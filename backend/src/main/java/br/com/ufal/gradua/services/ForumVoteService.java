package br.com.ufal.gradua.services;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.ufal.gradua.models.forum.ForumTopicModel;
import br.com.ufal.gradua.models.forum.ForumVoteModel;
import br.com.ufal.gradua.models.forum.ForumVoteModel.VoteType;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.ForumTopicRepository;
import br.com.ufal.gradua.repositories.ForumVoteRepository;

@Service
@Transactional
public class ForumVoteService {

    @Autowired ForumVoteRepository voteRepository;
    @Autowired ForumTopicRepository topicRepository;

    private UserModel getCurrentUser() {
        return (UserModel) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    /**
     * Registra ou alterna o voto do usuário logado num tópico.
     * Lógica: se já votou com mesmo tipo → remove (toggle off).
     *         se votou com tipo diferente → troca.
     *         se não votou → cria.
     * Retorna o novo voteScore do tópico junto com os totais de up/down.
     */
    public Map<String, Object> vote(UUID topicId, String voteTypeStr) {
        UserModel user = getCurrentUser();
        ForumTopicModel topic = topicRepository.findById(topicId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tópico não encontrado"));

        // Avisos não permitem votação
        if ("AVISO".equalsIgnoreCase(topic.getType())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Avisos não permitem votação");
        }

        VoteType incoming = "down".equalsIgnoreCase(voteTypeStr) ? VoteType.DOWN : VoteType.UP;
        Optional<ForumVoteModel> existing = voteRepository.findByTopicAndAuthor(topic, user);

        if (existing.isPresent()) {
            ForumVoteModel vote = existing.get();
            if (vote.getVoteType() == incoming) {
                // Toggle off: remove o voto
                voteRepository.delete(vote);
            } else {
                // Troca o voto
                vote.setVoteType(incoming);
                voteRepository.save(vote);
            }
        } else {
            ForumVoteModel vote = new ForumVoteModel();
            vote.setTopic(topic);
            vote.setAuthor(user);
            vote.setVoteType(incoming);
            voteRepository.save(vote);
        }

        // Recalcula voteScore (UP - DOWN) e persiste no tópico
        long ups   = voteRepository.countByTopicAndVoteType(topic, VoteType.UP);
        long downs = voteRepository.countByTopicAndVoteType(topic, VoteType.DOWN);
        topic.setUpVoteCount((int) ups);
        topic.setDownVoteCount((int) downs);
        topic.setVoteScore((int)(ups - downs));
        topicRepository.save(topic);

        // Retorna o voto atual do usuário (null se removeu, "up" ou "down")
        Optional<ForumVoteModel> current = voteRepository.findByTopicAndAuthor(topic, user);
        String currentVote = current.map(v -> v.getVoteType().name().toLowerCase()).orElse(null);

        return Map.of(
            "ups", ups,
            "downs", downs,
            "voteScore", (long)(ups - downs),
            "currentUserVote", currentVote != null ? currentVote : ""
        );
    }

    /**
     * Retorna o estado de voto do usuário logado para um tópico.
     * Usado ao carregar o feed para mostrar se já votou.
     */
    public Map<String, Object> getVoteState(UUID topicId) {
        UserModel user = getCurrentUser();
        ForumTopicModel topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tópico não encontrado"));

        Optional<ForumVoteModel> current = voteRepository.findByTopicAndAuthor(topic, user);
        String currentVote = current.map(v -> v.getVoteType().name().toLowerCase()).orElse(null);

        // Retornamos direto da memória do tópico, milissegundos de tempo de resposta!
        return Map.of(
                "ups", topic.getUpVoteCount() != null ? topic.getUpVoteCount() : 0,
                "downs", topic.getDownVoteCount() != null ? topic.getDownVoteCount() : 0,
                "voteScore", topic.getVoteScore() != null ? topic.getVoteScore() : 0,
                "currentUserVote", currentVote != null ? currentVote : ""
        );
    }
}
