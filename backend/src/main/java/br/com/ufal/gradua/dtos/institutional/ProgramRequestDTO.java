package br.com.ufal.gradua.dtos.institutional;


import jakarta.validation.constraints.NotBlank;

public record ProgramRequestDTO(@NotBlank String name) {

}
