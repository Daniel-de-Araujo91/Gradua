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
import br.com.ufal.gradua.dtos.institutional.ProgramRequestDTO;
import br.com.ufal.gradua.dtos.institutional.ProgramResponseDTO;
import br.com.ufal.gradua.models.forum.ForumTopicModel;
import br.com.ufal.gradua.models.institutional.ProgramModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.forum.ForumCommentRepository;
import br.com.ufal.gradua.repositories.forum.ForumTopicRepository;
import br.com.ufal.gradua.repositories.institutional.ProgramRepository;
import jakarta.validation.Valid;

@Service
@Transactional
public class ProgramService {

    @Autowired
    ProgramRepository repository;

    private ProgramResponseDTO toDTO(ProgramModel program) {
        return new ProgramResponseDTO(
            program.getProgramId(),
            program.getName()
        );
    }

    public ProgramResponseDTO create(ProgramRequestDTO dto) {
        ProgramModel program = new ProgramModel();
        program.setName(dto.name());

        repository.save(program);

        return toDTO(program);
    }

    public List<ProgramResponseDTO> listAll() {
        List<ProgramModel> programs = repository.findAll();

        return programs.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ProgramResponseDTO update(UUID id, ProgramRequestDTO dto) {
        ProgramModel program = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Curso não encontrado"));

        program.setName(dto.name());;

        repository.save(program);

        return toDTO(program);
    }

    public void delete(UUID id) {
        ProgramModel program = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Curso não encontrado"));

        repository.delete(program);
    }
}




