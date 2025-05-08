package com.paf.socialmedia.controller;

import com.paf.socialmedia.dto.ChatMessageDTO;

import java.util.Map;

import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public ChatWebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessageDTO message) {
        // Save to database if needed here

        // Send message to the specific user's queue
        messagingTemplate.convertAndSendToUser(
            String.valueOf(message.getConversationId()),
            "/queue/messages",
            message
        );
    }

    @MessageMapping("/presence")
    public void updatePresence(@Payload Map<String, Object> presenceInfo) {
        messagingTemplate.convertAndSend("/topic/presence", presenceInfo);
    }
}
