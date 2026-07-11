package br.com.ufal.gradua.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ufal.gradua.models.agenda.ReminderModel;
import br.com.ufal.gradua.models.user.UserModel;

public interface ReminderRepository extends JpaRepository<ReminderModel, UUID> {
    List<ReminderModel> findByUserAndDateOrderByTimeAsc(UserModel user, LocalDate date);
}