package br.com.ufal.gradua.models.academic;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDTO {
    private UUID enrollmentId;
    private String studentName;
    private Boolean present;
}
