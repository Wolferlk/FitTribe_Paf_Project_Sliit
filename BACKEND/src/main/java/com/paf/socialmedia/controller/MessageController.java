package com.paf.socialmedia.controller;

import com.paf.socialmedia.document.Message;
import com.paf.socialmedia.repository.MessageRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:3000" )  // Allow CORS for frontend on localhost:3000
public class MessageController {

    private final MessageRepository messageRepository;

    public MessageController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @GetMapping("/conversation/{id}")
    public List<Message> getMessagesByConversation(@PathVariable Long id) {
        return messageRepository.findByConversationId(id);
    }

    @PutMapping("/read/conversation/{conversationId}/user/{userId}")
    public void markAsRead(@PathVariable Long conversationId, @PathVariable Long userId) {
        List<Message> unread = messageRepository.findByConversationIdAndReadFalseAndSenderIdNot(conversationId, userId);
        for (Message message : unread) {
            message.setRead(true);
        }
        messageRepository.saveAll(unread);
    }

    @PostMapping("/send")
    @CrossOrigin(origins = "http://localhost:3000")  // Allow POST requests from frontend on localhost:3000
    public Message sendMessage(@RequestBody Message message) {
        return messageRepository.save(message);
    }
}
