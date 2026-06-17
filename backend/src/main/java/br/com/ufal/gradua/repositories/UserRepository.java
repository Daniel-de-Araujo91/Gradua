package br.com.ufal.gradua.repositories;

import java.util.UUID;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.ufal.gradua.models.user.UserModel;

@Repository
public interface UserRepository extends JpaRepository<UserModel, UUID> {

    // --- MÉTODO ADICIONADO PARA A AGENDA (e Dashboard) ---
    // Ele carrega o usuário e os dados do estudante associado na mesma consulta.
    @EntityGraph(attributePaths = {"student"})
    Optional<UserModel> findWithStudentByUserId(UUID userId);

    default Optional<UserModel> findByCpfOrPassport(String document) {
        return this.findByCpfOrPassport(document, document);
    }

    Optional<UserModel> findByCpfOrPassport(String cpf, String passport);
}