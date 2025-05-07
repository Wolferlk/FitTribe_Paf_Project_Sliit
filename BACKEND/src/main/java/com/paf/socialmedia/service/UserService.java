package com.paf.socialmedia.service;

import com.paf.socialmedia.document.User;
import com.paf.socialmedia.dto.LoginDTO;
import com.paf.socialmedia.dto.SignupDTO;
import com.paf.socialmedia.repository.UserRepository;
import com.paf.socialmedia.security.JwtTokenGenerator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.stereotype.Service;

import java.text.MessageFormat;

@Service
public class UserService implements UserDetailsManager {
    
    @Autowired
    UserRepository userRepository;

    @Autowired
    private JwtTokenGenerator jwtTokenGenerator;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public void createUser(UserDetails user) {
        ((User) user).setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save((User) user);
    }

    @Override
    public void updateUser(UserDetails user) {

    }

    @Override
    public void deleteUser(String username) {

    }

    @Override
    public void changePassword(String oldPassword, String newPassword) {

    }

    @Override
    public boolean userExists(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        MessageFormat.format("username {0} not found", username)
                ));
    }

    

    // UserService.java (add this method)
public String login(String username, String password) {
    UserDetails userDetails = loadUserByUsername(username);
    
    if (passwordEncoder.matches(password, userDetails.getPassword())) {
        // Generate JWT token
        return jwtTokenGenerator.generateToken(((User) userDetails).getId());
    } else {
        throw new BadCredentialsException("Invalid password");
    }
}
    
}
