package com.paf.socialmedia.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.paf.socialmedia.document.User;
import com.paf.socialmedia.dto.TokenDTO;
import com.paf.socialmedia.repository.UserRepository;
import com.paf.socialmedia.security.TokenGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class OAuth2Service {

    @Value("${google.client-id}")
    private String googleClientId;

    @Autowired
    UserRepository userRepository;

    @Autowired
    TokenGenerator tokenGenerator;

    public TokenDTO loginWithGoogle(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    JacksonFactory.getDefaultInstance()
            ).setAudience(Collections.singletonList(googleClientId)).build();

            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String pictureUrl = (String) payload.get("picture");

                Optional<User> optionalUser = userRepository.findByUsername(email);

                User user;
                if (optionalUser.isPresent()) {
                    user = optionalUser.get();
                } else {
                    user = new User();
                    user.setUsername(email);
                    user.setUsername(name);
                    user.setPassword(""); // no password for OAuth
                    user.setImageUrl(pictureUrl);
                    userRepository.save(user);
                }

                Authentication auth = new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());
                return tokenGenerator.createToken(auth);

            } else {
                throw new RuntimeException("Invalid ID token");
            }

        } catch (Exception e) {
            throw new RuntimeException("Google login failed", e);
        }
    }
}
