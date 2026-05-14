package br.com.ufal.gradua.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import org.springframework.web.bind.annotation.PostMapping;

import java.math.BigDecimal;

@Entity
@Table(name = "TB_STUDENT")
@PrimaryKeyJoinColumn(name = "user_id")
public class StudentModel extends UserModel{
    @Column(name = "registration",unique = true ,length = 50)
    private String registration;
    private BigDecimal ira;
    private int integratedHours;
    private String course;

    public String getRegistration() {
        return registration;
    }

    public void setRegistration(String registration) {
        this.registration = registration;
    }

    public BigDecimal getIra() {
        return ira;
    }

    public void setIra(BigDecimal ira) {
        this.ira = ira;
    }

    public int getIntegratedHours() {
        return integratedHours;
    }

    public void setIntegratedHours(int integratedHours) {
        this.integratedHours = integratedHours;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }
}
