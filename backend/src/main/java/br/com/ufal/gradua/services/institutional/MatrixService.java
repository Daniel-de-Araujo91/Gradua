package br.com.ufal.gradua.services.institutional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.ufal.gradua.dtos.institutional.MatrixRequestDTO;
import br.com.ufal.gradua.dtos.institutional.MatrixResponseDTO;
import br.com.ufal.gradua.models.institutional.CurriculumMatrixModel;
import br.com.ufal.gradua.models.institutional.CurriculumModel;
import br.com.ufal.gradua.models.institutional.SubjectModel;
import br.com.ufal.gradua.repositories.institutional.CurriculumRepository;
import br.com.ufal.gradua.repositories.institutional.MatrixRepository;
import br.com.ufal.gradua.repositories.institutional.SubjectRepository;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class MatrixService {

    @Autowired
    MatrixRepository repository;

    @Autowired
    SubjectRepository subjectRepository;

    @Autowired
    CurriculumRepository curriculumRepository;

    private MatrixResponseDTO toDTO(CurriculumMatrixModel matrix) {
        return new MatrixResponseDTO(
           matrix.getGridId(),
           matrix.getCurriculum().getName(),
           matrix.getSubject().getCode(),
           matrix.getSubjectType(),
           matrix.getIdealSemester()
        );
    }

    public MatrixResponseDTO create(MatrixRequestDTO dto) {
        CurriculumMatrixModel matrix = new CurriculumMatrixModel();
        
       SubjectModel subject = (SubjectModel) subjectRepository.findByCode(dto.subjectCode());

       CurriculumModel curriculum = curriculumRepository.findByName(dto.curriculumName());

       matrix.setCurriculum(curriculum);
       matrix.setSubject(subject);
       matrix.setSubjectType(dto.subjectType());
       matrix.setIdealSemester(dto.idealSemester());

        repository.save(matrix);

        return toDTO(matrix);
    }

    public List<MatrixResponseDTO> listAll() {
        List<CurriculumMatrixModel> matrix = repository.findAll();

        return matrix.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public MatrixResponseDTO update(UUID id, MatrixRequestDTO dto) {
        CurriculumMatrixModel matrix = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "PPC não encontrado"));

        
       SubjectModel subject = (SubjectModel) subjectRepository.findByCode(dto.subjectCode());

       CurriculumModel curriculum = curriculumRepository.findByName(dto.curriculumName());

       matrix.setCurriculum(curriculum);
       matrix.setSubject(subject);
       matrix.setSubjectType(dto.subjectType());
       matrix.setIdealSemester(dto.idealSemester());

        repository.save(matrix);

        return toDTO(matrix);
    }

    public void delete(UUID id) {
        CurriculumMatrixModel matrix = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "PPC não encontrado"));

        repository.delete(matrix);
    }
}




