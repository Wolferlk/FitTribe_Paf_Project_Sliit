package com.paf.socialmedia.controller;

import com.paf.socialmedia.document.User;
import com.paf.socialmedia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    // Get the authenticated user by id (using the authenticated user object)
    @PreAuthorize("#user.id == #id")
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@AuthenticationPrincipal User user, @PathVariable String id) {
        try {
            logger.info("Fetching user with ID: " + id); // Log the ID being fetched

            Optional<User> userOptional = userRepository.findById(id);
            if (userOptional.isPresent()) {
                return ResponseEntity.ok(userOptional.get());
            } else {
                logger.warn("User with ID " + id + " not found.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            logger.error("Error occurred while fetching user with ID " + id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Retrieve all users in the system
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            return ResponseEntity.ok(userRepository.findAll());
        } catch (Exception e) {
            logger.error("Error occurred while fetching all users", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching users");
        }
    }

    // Update the user with a given id
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserById(@PathVariable String id, @RequestBody User user) {
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isPresent()) {
            User updateUser = existingUser.get();
            // Only update non-null fields
            if (user.getContactNumber() != null) {
                updateUser.setContactNumber(user.getContactNumber());
            }
            if (user.getProfileImage() != null) {
                updateUser.setProfileImage(user.getProfileImage());
            }
            if (user.getEmail() != null) {
                updateUser.setEmail(user.getEmail());
            }
            if (user.getCountry() != null) {
                updateUser.setCountry(user.getCountry());
            }
            userRepository.save(updateUser);
            return new ResponseEntity<>(updateUser, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    }

    // Delete the user with a given id
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUserById(@PathVariable String id) {
        try {
            if (userRepository.existsById(id)) {
                userRepository.deleteById(id);
                return new ResponseEntity<>("User deleted with ID: " + id, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            logger.error("Error occurred while deleting user with ID " + id, e);
            return new ResponseEntity<>("Error deleting user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update user's followedBy field to include another user's ID
    @PutMapping("/follow/{userId}")
    public ResponseEntity<?> followUser(@PathVariable String userId, @RequestBody User followerUser) {
        Optional<User> existingUser = userRepository.findById(userId);
        if (existingUser.isPresent()) {
            User updateUser = existingUser.get();
            // Ensure we're adding the follower's ID to the followedBy list
            if (followerUser.getFollowedBy() != null) {
                updateUser.getFollowedBy().addAll(followerUser.getFollowedBy());
            }
            userRepository.save(updateUser);
            return new ResponseEntity<>(updateUser, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    }
}
