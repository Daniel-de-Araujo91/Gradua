package br.com.ufal.gradua.dtos.forum;


import jakarta.validation.constraints.NotBlank;

public record ForumVoteRequestDTO(@NotBlank String type) {

}
