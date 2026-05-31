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
import br.com.ufal.gradua.dtos.institutional.CurriculumRequestDTO;
import br.com.ufal.gradua.dtos.institutional.CurriculumResponseDTO;
import br.com.ufal.gradua.models.forum.ForumTopicModel;
import br.com.ufal.gradua.models.institutional.CurriculumModel;
import br.com.ufal.gradua.models.institutional.ProgramModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.forum.ForumCommentRepository;
import br.com.ufal.gradua.repositories.forum.ForumTopicRepository;
import br.com.ufal.gradua.repositories.institutional.CurriculumRepository;
import br.com.ufal.gradua.repositories.institutional.ProgramRepository;
import jakarta.validation.Valid;

@Service
@Transactional
public class CurriculumService {

    @Autowired
    CurriculumRepository repository;

    @Autowired
    ProgramRepository programRepository;

    private CurriculumResponseDTO toDTO(CurriculumModel curriculum) {
        return new CurriculumResponseDTO(
            curriculum.getCurriculumId(),
            curriculum.getProgram().getName(),
            curriculum.getName(),
            curriculum.getEffectiveYear(),
            curriculum.getReqMandatoryHours(),
            curriculum.getReqElectiveHours(),
            curriculum.getReqComplementaryHours(),
            curriculum.getReqTotalHours()
        );
    }

    public CurriculumResponseDTO create(CurriculumRequestDTO dto) {
        CurriculumModel curriculum = new CurriculumModel();
        
        ProgramModel program = programRepository.findByName(dto.programName());

        curriculum.setProgram(program);
        curriculum.setName(dto.name());
        curriculum.setEffectiveYear(dto.effectiveYear());
        curriculum.setReqMandatoryHours(dto.reqMandatoryHours());
        curriculum.setReqElectiveHours(dto.reqElectiveHours());
        curriculum.setReqComplementaryHours(dto.reqComplementaryHours());
        curriculum.setReqTotalHours(dto.reqTotalHours());

        repository.save(curriculum);

        return toDTO(curriculum);
    }

    public List<CurriculumResponseDTO> listAll() {
        List<CurriculumModel> curriculums = repository.findAll();

        return curriculums.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public CurriculumResponseDTO update(UUID id, CurriculumRequestDTO dto) {
        CurriculumModel curriculum = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "PPC não encontrado"));

        ProgramModel program = programRepository.findByName(dto.programName());

        curriculum.setProgram(program);
        curriculum.setEffectiveYear(dto.effectiveYear());
        curriculum.setReqMandatoryHours(dto.reqMandatoryHours());
        curriculum.setReqElectiveHours(dto.reqElectiveHours());
        curriculum.setReqComplementaryHours(dto.reqComplementaryHours());
        curriculum.setReqTotalHours(dto.reqTotalHours());

        repository.save(curriculum);

        return toDTO(curriculum);
    }

    public void delete(UUID id) {
        CurriculumModel curriculum = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "PPC não encontrado"));

        repository.delete(curriculum);
    }
}




