package br.com.ufal.gradua.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.document.DocumentModel;
import br.com.ufal.gradua.models.user.UserModel;

public interface DocumentRepository extends JpaRepository<DocumentModel, UUID> {
    List<DocumentModel> findByUserOrderByCreatedAtDesc(UserModel user);
    Optional<DocumentModel> findByUserAndDocType(UserModel user, String docType);
    void deleteByUserAndDocType(UserModel user, String docType);
}
