package br.com.ufal.gradua.dtos;

import java.util.UUID;

/**
 * DTO retornado após login / register. Inclui userId para identificação
 * do usuário no frontend (controle de autoria e permissões de UI).
 */
public record ResponseDTO(UUID userId, String firstName, String lastName, String role, String token) {

}
