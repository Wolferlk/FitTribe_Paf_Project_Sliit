package com.paf.socialmedia.controller;

import com.paf.socialmedia.dto.MessageDTO;
import com.paf.socialmedia.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/messages")
public class MessageController {
    
    @Autowired
    private MessageService messageService;
    
    @GetMapping("/conversation/{conversationId}")
    public ResponseEntity<List<MessageDTO>> getMessagesForConversation(
            @PathVariable String conversationId,
            @RequestParam String userId) {
        List<MessageDTO> messages = messageService.getMessagesForConversation(conversationId, userId);
        return ResponseEntity.ok(messages);
    }
    
    @PostMapping
    public ResponseEntity<MessageDTO> saveMessage(@RequestBody MessageDTO messageDTO) {
        MessageDTO savedMessage = messageService.saveMessage(messageDTO);
        return ResponseEntity.ok(savedMessage);
    }
    
    @PutMapping("/read/conversation/{conversationId}/user/{userId}")
    public ResponseEntity<Void> markMessagesAsRead(
            @PathVariable String conversationId,
            @PathVariable String userId) {
        messageService.markMessagesAsRead(conversationId, userId);
        return ResponseEntity.ok().build();
    }
}