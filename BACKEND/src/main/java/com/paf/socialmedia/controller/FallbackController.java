package com.paf.socialmedia.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FallbackController {

    @GetMapping("/home")
    public String handleError() {
        return "Something went wrong. Please try again later.";
    }

    @GetMapping("/home") // Test endpoint after login (optional)
    public String home() {
        return "Welcome! You are logged in.";
    }
}
