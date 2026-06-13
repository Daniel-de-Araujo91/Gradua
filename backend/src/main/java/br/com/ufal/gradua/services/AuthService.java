package br.com.ufal.gradua.services;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.ufal.gradua.dtos.LoginRequestDTO;
import br.com.ufal.gradua.dtos.RegisterRequestDTO;
import br.com.ufal.gradua.dtos.ResponseDTO;
import br.com.ufal.gradua.infra.security.TokenService;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public ResponseDTO login(LoginRequestDTO dto) {
        UserModel user = userRepository.findByCpfOrPassport(dto.document())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!passwordEncoder.matches(dto.password(), user.getPasswordHash())) {
            throw new RuntimeException("Documento ou senha incorretos");
        }

        String token = tokenService.generateToken(user);
        return new ResponseDTO(user.getUserId(), user.getFirstName(), user.getLastName(), user.getRole(), token);
    }

    public ResponseDTO register(RegisterRequestDTO dto) {
        Optional<UserModel> existing = userRepository.findByCpfOrPassport(dto.document());
        if (existing.isPresent()) {
            throw new RuntimeException("Usuário já cadastrado com este documento");
        }

        UserModel newUser = new UserModel();
        newUser.setPasswordHash(passwordEncoder.encode(dto.password()));
        newUser.setFirstName(dto.firstName());
        newUser.setLastName(dto.lastName());
        newUser.setEmail(dto.email());
        newUser.setIsForeigner(dto.isForeigner());

        if (dto.isForeigner()) {
            newUser.setPassport(dto.document());
        } else {
            newUser.setCpf(dto.document());
        }

        userRepository.save(newUser);

        String token = tokenService.generateToken(newUser);
        return new ResponseDTO(newUser.getUserId(), newUser.getFirstName(), newUser.getLastName(), newUser.getRole(), token);
    }
}
