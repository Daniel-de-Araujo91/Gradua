package br.com.ufal.gradua.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.ufal.gradua.models.forum.ForumTopicModel;
import br.com.ufal.gradua.repositories.ForumTopicRepository;

@Service
public class CleanupService {

    @Autowired
    private ForumTopicRepository topicRepository;

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void autoDeleteExpiredHiddenTopics() {
        LocalDateTime deadline = LocalDateTime.now().minusHours(48);
        List<ForumTopicModel> expired = topicRepository.findByHiddenTrueAndHiddenAtBefore(deadline);

        for (ForumTopicModel topic : expired) {
            topicRepository.delete(topic);
        }
    }
}
