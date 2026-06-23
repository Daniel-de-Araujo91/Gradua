package br.com.ufal.gradua.services;

import br.com.ufal.gradua.models.forum.ForumTopicModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.ForumTopicRepository;
import br.com.ufal.gradua.repositories.ForumReportRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ForumTopicServiceTest {

    @Mock
    private ForumTopicRepository repository;

    @Mock
    private ForumReportRepository reportRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private ForumVoteService forumVoteService;

    @Mock
    private ForumReportService forumReportService;

    @InjectMocks
    private ForumTopicService forumTopicService;

    @BeforeEach
    public void setUp() {
        Authentication authentication = mock(Authentication.class);
        UserModel user = new UserModel();
        user.setUserId(UUID.randomUUID());
        user.setFirstName("Test");
        user.setLastName("User");
        user.setRole("USER");
        lenient().when(authentication.getPrincipal()).thenReturn(user);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @Test
    public void testCheckAndDeleteTopicShouldDeleteWhenFiveDownVotes() {
        ForumTopicModel topic = new ForumTopicModel();
        topic.setTopicId(UUID.randomUUID());
        topic.setDownVoteCount(5);
        topic.setReportCount(0);

        forumTopicService.checkAndDeleteTopic(topic);

        verify(repository).delete(topic);
    }

    @Test
    public void testCheckAndDeleteTopicShouldDeleteWhenThreeReports() {
        ForumTopicModel topic = new ForumTopicModel();
        topic.setTopicId(UUID.randomUUID());
        topic.setDownVoteCount(0);
        topic.setReportCount(3);

        forumTopicService.checkAndDeleteTopic(topic);

        verify(repository).delete(topic);
    }

    @Test
    public void testCheckAndDeleteTopicShouldNotDeleteBelowThreshold() {
        ForumTopicModel topic = new ForumTopicModel();
        topic.setTopicId(UUID.randomUUID());
        topic.setDownVoteCount(4);
        topic.setReportCount(2);

        forumTopicService.checkAndDeleteTopic(topic);

        verify(repository, never()).delete(topic);
    }
}
