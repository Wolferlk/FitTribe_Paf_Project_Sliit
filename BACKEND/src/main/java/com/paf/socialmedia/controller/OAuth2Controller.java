package com.paf.socialmedia.controller;

import com.paf.socialmedia.document.User;
import com.paf.socialmedia.repository.UserRepository;
import com.paf.socialmedia.security.JwtTokenGenerator;
import com.paf.socialmedia.dto.TokenDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class OAuth2Controller {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenGenerator jwtTokenGenerator;

    @GetMapping("/oauth2/success")
    public ResponseEntity<?> handleOAuth2Success(Authentication authentication) {
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oauth2User = oauthToken.getPrincipal();
        
        String email = oauth2User.getAttribute("email");
        String provider = oauthToken.getAuthorizedClientRegistrationId();
        String providerId = oauth2User.getAttribute("sub");
        
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String token = jwtTokenGenerator.generateToken(user.getId());
            
            TokenDTO tokenDTO = new TokenDTO();
            tokenDTO.setToken(token);
            tokenDTO.setType("Bearer");
            tokenDTO.setId(user.getId());
            tokenDTO.setUsername(user.getUsername());
            tokenDTO.setEmail(user.getEmail());
            
            return ResponseEntity.ok(tokenDTO);
        }
        
        return ResponseEntity.badRequest().body("User not found");
    }
}