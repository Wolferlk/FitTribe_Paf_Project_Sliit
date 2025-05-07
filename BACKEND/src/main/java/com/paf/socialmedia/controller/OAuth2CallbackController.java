package com.paf.socialmedia.controller;

import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class OAuth2CallbackController {

    @GetMapping("/oauth2/callback")
    public String handleOAuth2Login(@AuthenticationPrincipal OAuth2User oauthUser) {
        // Handle the OAuth2 User after login here
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        
        return "Hello, " + name + " (" + email + ")";
    }
}
