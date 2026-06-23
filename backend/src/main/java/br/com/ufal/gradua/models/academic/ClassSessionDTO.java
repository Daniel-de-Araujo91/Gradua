package br.com.ufal.gradua.models.academic;

import java.time.LocalDate;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ClassSessionDTO {
    private UUID sessionId;
    private UUID classId;
    private LocalDate date;
    private String description;
}
