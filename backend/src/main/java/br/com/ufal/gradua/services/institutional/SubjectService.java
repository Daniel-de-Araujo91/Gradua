package br.com.ufal.gradua.services.institutional;

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


import br.com.ufal.gradua.dtos.forum.ForumTopicRequestDTO;
import br.com.ufal.gradua.dtos.forum.ForumTopicResponseDTO;
import br.com.ufal.gradua.dtos.institutional.SubjectRequestDTO;
import br.com.ufal.gradua.dtos.institutional.SubjectResponseDTO;
import br.com.ufal.gradua.models.forum.ForumTopicModel;
import br.com.ufal.gradua.models.institutional.SubjectModel;
import br.com.ufal.gradua.models.institutional.ProgramModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.forum.ForumCommentRepository;
import br.com.ufal.gradua.repositories.forum.ForumTopicRepository;
import br.com.ufal.gradua.repositories.institutional.SubjectRepository;
import br.com.ufal.gradua.repositories.institutional.ProgramRepository;
import jakarta.validation.Valid;

@Service
@Transactional
public class SubjectService {

    @Autowired
    SubjectRepository repository;

    
    private SubjectResponseDTO toDTO(SubjectModel subject) {
        return new SubjectResponseDTO(
            subject.getSubjectId(),
            subject.getCode(),
            subject.getName(),
            subject.getCreditHours()
        );
    }

    public SubjectResponseDTO create(SubjectRequestDTO dto) {
        SubjectModel subject = new SubjectModel();
        

        subject.setCode(dto.code());
        subject.setName(dto.name());
        subject.setCreditHours(dto.creditHours());

        repository.save(subject);

        return toDTO(subject);
    }

    public List<SubjectResponseDTO> listAll() {
        List<SubjectModel> subjects = repository.findAll();

        return subjects.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public SubjectResponseDTO update(UUID id, SubjectRequestDTO dto) {
        SubjectModel subject = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Diciplina não encontrada"));

        

        subject.setCode(dto.code());
        subject.setName(dto.name());
        subject.setCreditHours(dto.creditHours());


        repository.save(subject);

        return toDTO(subject);
    }

    public void delete(UUID id) {
        SubjectModel subject = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Diciplina não encontrada"));

        repository.delete(subject);
    }
}




