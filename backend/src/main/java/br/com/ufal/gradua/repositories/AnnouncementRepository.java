package br.com.ufal.gradua.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.forum.AnnouncementModel;

public interface AnnouncementRepository extends JpaRepository<AnnouncementModel, UUID> {
    List<AnnouncementModel> findAllByOrderByPublishDateDesc();


}
