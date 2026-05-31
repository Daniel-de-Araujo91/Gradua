package br.com.ufal.gradua.dtos.forum;


import jakarta.validation.constraints.NotBlank;

public record ForumCommentRequestDTO(@NotBlank String content) {

}
