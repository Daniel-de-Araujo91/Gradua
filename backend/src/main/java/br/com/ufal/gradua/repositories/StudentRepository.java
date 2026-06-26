package br.com.ufal.gradua.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.ufal.gradua.models.auth.StudentModel;
import br.com.ufal.gradua.models.user.UserModel;

public interface StudentRepository extends JpaRepository<StudentModel, UUID> {

    @Query("SELECT s.user FROM StudentModel s WHERE s.program.programId = :programId")
    List<UserModel> findUsersByProgramId(@Param("programId") UUID programId);
}
