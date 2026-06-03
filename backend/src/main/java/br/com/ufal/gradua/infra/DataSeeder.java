package br.com.ufal.gradua.infra;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        String adminCpf = "00000000000";
        if (userRepository.findByCpfOrPassport(adminCpf).isEmpty()) {
            log.info("Criando conta de ADMIN padrão para testes...");
            UserModel admin = new UserModel();
            admin.setFirstName("Admin");
            admin.setLastName("Teste");
            admin.setEmail("admin@gradua.ufal.br");
            admin.setCpf(adminCpf);
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            admin.setIsForeigner(false);
            
            userRepository.save(admin);
            log.info("Conta ADMIN criada: CPF={} / Senha={}", adminCpf, "admin123");
        } else {
            log.info("Conta ADMIN padrão já existe.");
        }
    }
}
