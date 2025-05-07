package com.paf.socialmedia.controller;

import com.paf.socialmedia.document.User;
import com.paf.socialmedia.dto.LoginDTO;
import com.paf.socialmedia.dto.SignupDTO;
import com.paf.socialmedia.dto.TokenDTO;
import com.paf.socialmedia.repository.UserRepository;
import com.paf.socialmedia.security.TokenGenerator;
import com.paf.socialmedia.service.OAuth2UserService;
import com.paf.socialmedia.service.UserService;

import org.springframework.beans.factory.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.BearerTokenAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationProvider;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class   AuthController {

    @Autowired
    UserDetailsManager userDetailsManager;

    @Autowired
    TokenGenerator tokenGenerator;

    @Autowired
    DaoAuthenticationProvider daoAuthenticationProvider;

    @Autowired
    @Qualifier("jwtRefreshTokenAuthProvider")
    JwtAuthenticationProvider refreshTokenAuthProvider;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService authService;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    // For OAuth2 front-end redirection
    @GetMapping("/google")
    public ResponseEntity<?> getGoogleAuthUrl() {
        String googleAuthUrl = "https://accounts.google.com/o/oauth2/auth" +
                "?client_id=" + googleClientId +
                "&redirect_uri=http://localhost:8080/api/auth/oauth2/callback/google" +
                "&response_type=code" +
                "&scope=email%20profile";

        return ResponseEntity.ok(googleAuthUrl);
    }

    // Register new user using username & password
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody SignupDTO registerDTO) {
        User user = new User(registerDTO.getUsername(), registerDTO.getPassword());
        userDetailsManager.createUser(user);

        Authentication authentication = UsernamePasswordAuthenticationToken.authenticated(user, registerDTO.getPassword(), Collections.emptyList());

        return ResponseEntity.ok(tokenGenerator.createToken(authentication));
    }

    // Login using username & password
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {

        Authentication authentication = daoAuthenticationProvider.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(
                        loginDTO.getUsername(), loginDTO.getPassword()
                )
        );

        Optional<User> existingUser = userRepository.findByUsername(loginDTO.getUsername());
        if (existingUser.isPresent() && existingUser.get().isDeleted()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Account deleted");
        }

        return ResponseEntity.ok(tokenGenerator.createToken(authentication));
    }

    // Generate new access token using a valid refresh token
    @PostMapping("/token")
    public ResponseEntity<?> refreshToken(@RequestBody TokenDTO tokenDTO) {
        Authentication authentication = refreshTokenAuthProvider.authenticate(
                new BearerTokenAuthenticationToken(tokenDTO.getRefreshToken())
        );
        Jwt jwt = (Jwt) authentication.getCredentials();

        return ResponseEntity.ok(tokenGenerator.createToken(authentication));
    }

    // OPTIONAL: If you plan to use AuthService for abstracted logic
    // This method uses AuthService for login
    @PostMapping("/login/service")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
    try {
        String token = userService.login(loginDTO.getUsername(), loginDTO.getPassword());
        return ResponseEntity.ok(Map.of("token", token));
    } catch (UsernameNotFoundException | BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
}
}
