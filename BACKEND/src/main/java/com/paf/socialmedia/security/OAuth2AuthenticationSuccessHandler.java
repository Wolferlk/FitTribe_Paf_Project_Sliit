package com.paf.socialmedia.security;

import com.paf.socialmedia.document.User;
import com.paf.socialmedia.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final TokenGenerator tokenGenerator;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // Check if user exists in DB, else create
        Optional<User> userOpt = userRepository.findByUsername(email);
        User user;
        if (userOpt.isPresent()) {
            user = userOpt.get();
        } else {
            user = new User();
            user.setUsername(email);
            user.setEmail(email);
            user.setFullName(name);
            userRepository.save(user);
        }

        // Generate JWT tokens (your own)
        var tokenResponse = tokenGenerator.createToken(authentication);

        // Return tokens in JSON response
        response.setContentType("application/json");
        response.getWriter().write(tokenResponse.toString());
    }

    @Override
    public void onAuthenticationSuccess(javax.servlet.http.HttpServletRequest request,
            javax.servlet.http.HttpServletResponse response, Authentication authentication)
            throws IOException, javax.servlet.ServletException {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'onAuthenticationSuccess'");
    }
}
