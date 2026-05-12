package br.com.ufal.gradua.services;

import br.com.ufal.gradua.dtos.StudentRecordDto;
import br.com.ufal.gradua.models.StudentModel;
import br.com.ufal.gradua.repositories.StudentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class StudentService {

    @Autowired
    StudentRepository studentRepository;

    @Transactional
    public StudentModel save(StudentRecordDto dto) {
        var student = new StudentModel();
        BeanUtils.copyProperties(dto, student);
        student.setPasswordHash(PasswordService.encryptPassword(student.getPasswordHash()));
        return studentRepository.save(student);
    }

    public List<StudentModel> findAll() {
        return  studentRepository.findAll();
    }

    public Object getById(UUID id) {
        Optional<StudentModel> student = studentRepository.findById(id);
        return student.get();
    }

    public Object updateStudent(UUID id, StudentRecordDto dto) {
        Optional<StudentModel> student = studentRepository.findById(id);
        var studentModel = student.get();
        BeanUtils.copyProperties(dto, studentModel);
        studentModel.setPasswordHash(PasswordService.encryptPassword(studentModel.getPasswordHash()));
        return studentRepository.save(studentModel);
    }

}
