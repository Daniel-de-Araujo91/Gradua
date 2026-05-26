package br.com.ufal.gradua.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.ufal.gradua.models.user.UserModel;
import java.util.Optional;





@Repository
public interface UserRepository extends JpaRepository<UserModel, UUID>{

    default Optional<UserModel> findByCpfOrPassport(String document)
    {
        return this.findByCpfOrPassport(document,document);
    }

    Optional<UserModel> findByCpfOrPassport(String cpf, String passport);
} 
