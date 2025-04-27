package com.paf.socialmedia.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.Map;

@Controller
public class PresenceWebSocketController {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @MessageMapping("/presence")
    public void handlePresence(@Payload Map<String, String> presenceInfo) {
        // Forward the presence update to all connected clients
        messagingTemplate.convertAndSend("/topic/presence", presenceInfo);
    }
}