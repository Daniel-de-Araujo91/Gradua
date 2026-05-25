package br.com.ufal.gradua.infra.security;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.UserRepository;

@Component
public class CustomUserDetailsService implements UserDetailsService{

    @Autowired
    private UserRepository repository;
   
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserModel user = this.repository.findByCpfOrPassport(username).orElseThrow(() -> new UsernameNotFoundException("User not Found"));
        if(user.getIsForeigner() == true){
            return new org.springframework.security.core.userdetails.User(user.getPassport(), user.getPasswordHash(), new ArrayList<>());
        }

        return new org.springframework.security.core.userdetails.User(user.getCpf(), user.getPasswordHash(), new ArrayList<>());
    }

}
