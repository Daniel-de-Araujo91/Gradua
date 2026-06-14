package br.com.ufal.gradua.dtos;

import java.util.UUID;
import java.math.BigDecimal;

public record ProfileDTO(UUID userId, String firstName, String lastName, String email, String role, String cpf, String passport,
                         UUID studentId, String enrollmentNumber, Integer currentTerm, BigDecimal ira)
{
}
