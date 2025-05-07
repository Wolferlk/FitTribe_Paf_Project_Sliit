package com.paf.socialmedia.controller;

import com.paf.socialmedia.dto.GoogleUserDTO;
import com.paf.socialmedia.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

/**
 * Handles endpoints related to Google OAuth2 login.
 */
@RestController
@RequestMapping("/user")
public class OAuth2LoginController {

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/google")
    public Map<String, Object> getGoogleUserWithTokens(@AuthenticationPrincipal OidcUser principal) {
        if (principal == null) {
            throw new RuntimeException("Unauthorized: Principal is null");
        }

        String accessToken = jwtUtil.generateAccessToken(principal.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(principal.getEmail());

        GoogleUserDTO user = new GoogleUserDTO();
        user.setId(principal.getSubject());
        user.setName(principal.getFullName());
        user.setEmail(principal.getEmail());
        user.setPicture(principal.getPicture());

        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);

        return response;
    }

    @GetMapping("/profile")
    public OidcUser getUserProfile(@AuthenticationPrincipal OidcUser principal) {
        return principal;
    }

    /**
     * Message shown after successful logout (if configured in security).
     */
    @GetMapping("/logout-success")
    public String logoutSuccess() {
        return "You have been logged out.";
    }
}
