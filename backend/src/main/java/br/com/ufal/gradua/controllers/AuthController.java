package br.com.ufal.gradua.controllers;

import br.com.ufal.gradua.dtos.LoginRequestDTO;
import br.com.ufal.gradua.dtos.RegisterRequestDTO;
import br.com.ufal.gradua.dtos.TokenResponseDTO;
import br.com.ufal.gradua.models.auth.ProfessorModel;
import br.com.ufal.gradua.models.auth.StudentModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.UserRepository;
import br.com.ufal.gradua.security.TokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDTO> login(@RequestBody @Valid LoginRequestDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.document(), data.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        var token = tokenService.generateToken((UserModel) auth.getPrincipal());
        return ResponseEntity.ok(new TokenResponseDTO(token));
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody @Valid RegisterRequestDTO data) {

        if (userRepository.findByCpfOrPassport(data.document(), data.document()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        UserModel newUser = new UserModel();
        newUser.setFirstName(data.firstName());
        newUser.setLastName(data.lastName());
        newUser.setEmail(data.email());
        newUser.setPasswordHash(passwordEncoder.encode(data.password()));
        newUser.setIsForeigner(data.isForeigner());

        if (data.isForeigner()) {
            newUser.setPassport(data.document());
        } else {
            newUser.setCpf(data.document());
        }

        if ("STUDENT".equalsIgnoreCase(data.role())) {
            StudentModel student = new StudentModel();
            student.setUser(newUser);
            newUser.setStudent(student);
        } else if ("PROFESSOR".equalsIgnoreCase(data.role())) {
            ProfessorModel professor = new ProfessorModel();
            professor.setUser(newUser);
            newUser.setProfessor(professor);
        }

        userRepository.save(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}