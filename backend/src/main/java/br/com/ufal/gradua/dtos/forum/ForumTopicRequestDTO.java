package br.com.ufal.gradua.dtos.forum;


import jakarta.validation.constraints.NotBlank;

public record ForumTopicRequestDTO(@NotBlank String title, @NotBlank String content,@NotBlank String type) {

}
