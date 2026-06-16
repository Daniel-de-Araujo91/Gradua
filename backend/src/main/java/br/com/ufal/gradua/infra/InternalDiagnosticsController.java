package br.com.ufal.gradua.infra;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.ufal.gradua.repositories.ForumTopicRepository;
import br.com.ufal.gradua.repositories.ForumCommentRepository;
import br.com.ufal.gradua.repositories.StudentRepository;
import br.com.ufal.gradua.repositories.SubjectRepository;
import br.com.ufal.gradua.repositories.EnrollmentRepository;
import lombok.RequiredArgsConstructor;

import java.util.Map;

@RestController
@RequestMapping("/internal")
@RequiredArgsConstructor
public class InternalDiagnosticsController {

    private final ForumTopicRepository forumTopicRepository;
    private final ForumCommentRepository forumCommentRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final EnrollmentRepository enrollmentRepository;

    @GetMapping("/counts")
    public Map<String, Long> counts() {
        return Map.of(
            "forumTopics", forumTopicRepository.count(),
            "forumComments", forumCommentRepository.count(),
            "students", studentRepository.count(),
            "subjects", subjectRepository.count(),
            "enrollments", enrollmentRepository.count()
        );
    }
}
