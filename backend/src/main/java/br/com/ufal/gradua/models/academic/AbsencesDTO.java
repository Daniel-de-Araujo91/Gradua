package br.com.ufal.gradua.models.academic;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AbsencesDTO {
    private int registered;
    private int remaining;
}
