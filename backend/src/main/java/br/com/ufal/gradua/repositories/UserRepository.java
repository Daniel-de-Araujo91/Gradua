package br.com.ufal.gradua.repositories;

import java.util.UUID;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.user.UserModel;

public interface UserRepository extends JpaRepository<UserModel, UUID> {

    @EntityGraph(attributePaths = {"student"})
    Optional<UserModel> findWithStudentByUserId(UUID userId);

    @EntityGraph(attributePaths = {"professor"})
    Optional<UserModel> findWithProfessorByUserId(UUID userId);

    default Optional<UserModel> findByCpfOrPassport(String document) {
        return this.findByCpfOrPassport(document, document);
    }

    Optional<UserModel> findByCpfOrPassport(String cpf, String passport);

    Optional<UserModel> findByEmail(String email);
}