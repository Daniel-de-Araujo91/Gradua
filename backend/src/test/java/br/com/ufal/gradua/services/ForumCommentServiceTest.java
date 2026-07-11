package br.com.ufal.gradua.services;

import br.com.ufal.gradua.models.forum.ForumCommentModel;
import br.com.ufal.gradua.models.forum.ForumTopicModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.ForumCommentRepository;
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

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ForumCommentServiceTest {

    @Mock
    private ForumCommentRepository commentRepository;

    @Mock
    private ForumTopicRepository topicRepository;

    @Mock
    private ForumReportRepository reportRepository;

    @Mock
    private ForumVoteService forumVoteService;

    @Mock
    private ForumReportService forumReportService;

    @InjectMocks
    private ForumCommentService forumCommentService;

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
    public void testCheckAndDeleteCommentShouldDeleteWhenFiveDownVotes() {
        ForumTopicModel topic = new ForumTopicModel();
        topic.setTopicId(UUID.randomUUID());
        topic.setCommentCount(5);

        ForumCommentModel comment = new ForumCommentModel();
        comment.setCommentId(UUID.randomUUID());
        comment.setDownVoteCount(5);
        comment.setReportCount(0);
        comment.setTopic(topic);

        forumCommentService.checkAndDeleteComment(comment);

        verify(commentRepository).delete(comment);
        assertEquals(4, topic.getCommentCount());
        verify(topicRepository).save(topic);
    }

    @Test
    public void testCheckAndDeleteCommentShouldDeleteWhenThreeReports() {
        ForumTopicModel topic = new ForumTopicModel();
        topic.setTopicId(UUID.randomUUID());
        topic.setCommentCount(3);

        ForumCommentModel comment = new ForumCommentModel();
        comment.setCommentId(UUID.randomUUID());
        comment.setDownVoteCount(0);
        comment.setReportCount(3);
        comment.setTopic(topic);

        forumCommentService.checkAndDeleteComment(comment);

        verify(commentRepository).delete(comment);
        assertEquals(2, topic.getCommentCount());
        verify(topicRepository).save(topic);
    }

    @Test
    public void testCheckAndDeleteCommentShouldNotDeleteBelowThreshold() {
        ForumCommentModel comment = new ForumCommentModel();
        comment.setCommentId(UUID.randomUUID());
        comment.setDownVoteCount(4);
        comment.setReportCount(2);

        forumCommentService.checkAndDeleteComment(comment);

        verify(commentRepository, never()).delete(comment);
    }
}
