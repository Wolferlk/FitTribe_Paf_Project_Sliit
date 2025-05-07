package com.paf.socialmedia.controller;

import com.paf.socialmedia.document.User;
import com.paf.socialmedia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserRepository userRepository;

    // ✅ Only one GET method for user by ID
    @GetMapping("/{id}")
    @PreAuthorize("#oauthUser.getAttribute('sub') == #id")
    public ResponseEntity<?> getUser(@AuthenticationPrincipal OAuth2User oauthUser, @PathVariable String id) {
        if (oauthUser != null) {
            String userId = oauthUser.getAttribute("sub");
            return ResponseEntity.ok(userRepository.findById(userId).orElseThrow());
        } else {
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserById(@PathVariable String id, @RequestBody User user) {
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isPresent()) {
            User updateUser = existingUser.get();
            if (user.getContactNumber() != null) updateUser.setContactNumber(user.getContactNumber());
            if (user.getProfileImage() != null) updateUser.setProfileImage(user.getProfileImage());
            if (user.getEmail() != null) updateUser.setEmail(user.getEmail());
            if (user.getCountry() != null) updateUser.setCountry(user.getCountry());
            return new ResponseEntity<>(userRepository.save(updateUser), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("User Update Error", HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUserById(@PathVariable String id) {
        try {
            userRepository.deleteById(id);
            return new ResponseEntity<>("Successfully deleted user with ID: " + id, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/follow/{userId}")
    public ResponseEntity<?> followUser(@PathVariable String userId, @RequestBody User user) {
        Optional<User> existingUser = userRepository.findById(userId);
        if (existingUser.isPresent()) {
            User updateUser = existingUser.get();
            if (user.getFollowedBy() != null) {
                updateUser.setFollowedBy(user.getFollowedBy());
            }
            return new ResponseEntity<>(userRepository.save(updateUser), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Follow Update Error", HttpStatus.NOT_FOUND);
        }
    }
}
