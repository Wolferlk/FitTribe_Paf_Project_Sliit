package com.paf.socialmedia.controller;

import com.paf.socialmedia.dto.MessageDTO;
import com.paf.socialmedia.document.Conversation;
import com.paf.socialmedia.document.User;
import com.paf.socialmedia.service.MessageService;
import com.paf.socialmedia.repository.ConversationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Optional;

@Controller
public class ChatWebSocketController {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private MessageService messageService;
    
    @Autowired
    private ConversationRepository conversationRepository;
    
    @MessageMapping("/chat")
    public void processMessage(@Payload MessageDTO messageDTO) {
        // Save the message
        MessageDTO savedMessage = messageService.saveMessage(messageDTO);
        
        // Get all recipients from the conversation
        Optional<Conversation> conversationOpt = conversationRepository.findById(messageDTO.getConversationId());
        if (conversationOpt.isPresent()) {
            Conversation conversation = conversationOpt.get();
            
            // Send message to each participant except sender
            for (User participant : conversation.getParticipants()) {
                if (!participant.getId().equals(messageDTO.getSenderId())) {
                    messagingTemplate.convertAndSendToUser(
                            participant.getId(),
                            "/queue/messages",
                            savedMessage
                    );
                }
            }
        }
    }
}