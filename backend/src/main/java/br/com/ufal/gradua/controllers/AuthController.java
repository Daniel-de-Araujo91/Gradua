package br.com.ufal.gradua.controllers;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.ufal.gradua.dtos.LoginRequestDTO;
import br.com.ufal.gradua.dtos.RegisterRequestDTO;
import br.com.ufal.gradua.dtos.ResponseDTO;
import br.com.ufal.gradua.infra.security.TokenService;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid LoginRequestDTO body){
        UserModel user = this.repository.findByCpfOrPassport(body.document()).orElseThrow(() -> new RuntimeException("User not found"));
        if(passwordEncoder.matches(body.password(), user.getPasswordHash())){
            String token = this.tokenService.generateToken(user);
            return ResponseEntity.ok(new ResponseDTO(user.getFirstName(), user.getLastName(), token));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect document or password");
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegisterRequestDTO body){
        Optional<UserModel> user = this.repository.findByCpfOrPassport(body.document());
        if(user.isEmpty()){
            UserModel newUser = new UserModel();
            newUser.setPasswordHash(passwordEncoder.encode(body.password()));
            newUser.setFirstName(body.firstName());
            newUser.setLastName(body.lastName());
            newUser.setEmail(body.email());
            newUser.setIsForeigner(body.isForeigner());
            if(body.isForeigner() == true) newUser.setPassport(body.document());
            else newUser.setCpf(body.document());
            this.repository.save(newUser);
        
            String token = this.tokenService.generateToken(newUser);
            return ResponseEntity.ok(new ResponseDTO(newUser.getFirstName(),newUser.getLastName(), token));
        }
        return ResponseEntity.badRequest().build();
    }
}
