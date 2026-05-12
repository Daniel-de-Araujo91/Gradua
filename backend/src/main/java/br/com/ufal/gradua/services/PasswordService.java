package br.com.ufal.gradua.services;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordService {
    public static String encryptPassword(String rawPassword) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.encode(rawPassword);
    }
}