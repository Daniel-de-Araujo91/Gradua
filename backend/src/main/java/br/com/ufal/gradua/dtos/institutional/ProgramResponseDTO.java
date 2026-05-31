package br.com.ufal.gradua.dtos.institutional;

import java.time.LocalDateTime;
import java.util.UUID;

public record ProgramResponseDTO(
    UUID programId, 
    String name
){}
