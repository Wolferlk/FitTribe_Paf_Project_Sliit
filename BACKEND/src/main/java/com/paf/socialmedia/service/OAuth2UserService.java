package com.paf.socialmedia.service;

import com.paf.socialmedia.document.User;
import com.paf.socialmedia.dto.GoogleOAuth2UserInfo;
import com.paf.socialmedia.dto.OAuth2UserInfo;
import com.paf.socialmedia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class OAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        try {
            return processOAuth2User(userRequest, oauth2User);
        } catch (Exception ex) {
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex);
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oauth2User) {
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2UserInfo userInfo;
        
        if (registrationId.equalsIgnoreCase("google")) {
            userInfo = new GoogleOAuth2UserInfo(oauth2User.getAttributes());
        } else {
            throw new OAuth2AuthenticationException("Login with " + registrationId + " is not supported yet.");
        }

        if (userInfo.getEmail() == null || userInfo.getEmail().isEmpty()) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        Optional<User> userOptional = userRepository.findByEmail(userInfo.getEmail());
        User user;

        if (userOptional.isPresent()) {
            user = userOptional.get();
            // Update existing user
            user.setProvider(registrationId);
            user.setProviderId(userInfo.getId());
            userRepository.save(user);
        } else {
            // Create new user
            user = new User();
            user.setUsername(userInfo.getEmail().split("@")[0]);
            user.setEmail(userInfo.getEmail());
            user.setProvider(registrationId);
            user.setProviderId(userInfo.getId());
            user.setProfilePicture(userInfo.getImageUrl());
            userRepository.save(user);
        }

        return oauth2User;
    }
}