package com.paf.socialmedia.controller;

import com.paf.socialmedia.dto.ConversationDTO;
import com.paf.socialmedia.service.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/conversations")
public class ConversationController {
    
    @Autowired
    private ConversationService conversationService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ConversationDTO>> getConversationsForUser(@PathVariable String userId) {
        List<ConversationDTO> conversations = conversationService.getConversationsForUser(userId);
        return ResponseEntity.ok(conversations);
    }
    
    @PostMapping("/create")
    public ResponseEntity<ConversationDTO> createConversation(
            @RequestParam String userId1, 
            @RequestParam String userId2) {
        ConversationDTO conversation = conversationService.getOrCreateConversation(userId1, userId2);
        return ResponseEntity.ok(conversation);
    }
}