package br.com.ufal.gradua.infra.security;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;

import br.com.ufal.gradua.models.user.UserModel;

@Service
public class TokenService {
    @Value("${api.security.token.secret}")
    private String secret;

    public String generateToken(UserModel user){
        try{
            Algorithm algorithm = Algorithm.HMAC256(secret);

            String token;
            if(user.getIsForeigner() == true){
                token = JWT.create().withIssuer("gradua").withSubject(user.getPassport()).withExpiresAt(this.generateExpirationDate()).sign(algorithm);
            }
            else{
                token = JWT.create().withIssuer("gradua").withSubject(user.getCpf()).withExpiresAt(this.generateExpirationDate()).sign(algorithm);
            }
            
            return token;

        }catch(JWTCreationException exception){
            throw new RuntimeException("Error while authenticating");
        }
    }

    public String validateToken(String token){
        try{
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm).withIssuer("gradua").build().verify(token).getSubject();
        } catch(JWTVerificationException exception){
            return null;
        }
    }
    private Instant generateExpirationDate(){
        return LocalDateTime.now().plusMinutes(30).toInstant(ZoneOffset.of("-3"));
        
    }
}
