package br.com.ufal.gradua;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "br.com.ufal.gradua")
public class GraduaApplication {

	public static void main(String[] args) {
		SpringApplication.run(GraduaApplication.class, args);
	}

}
