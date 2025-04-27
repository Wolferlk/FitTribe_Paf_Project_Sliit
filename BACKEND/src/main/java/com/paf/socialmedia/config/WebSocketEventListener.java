package com.paf.socialmedia.config;

import com.paf.socialmedia.dto.PresenceUpdateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketEventListener {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    private final Map<String, String> sessionUserMap = new ConcurrentHashMap<>();
    
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String userId = headerAccessor.getFirstNativeHeader("userId");
        String sessionId = headerAccessor.getSessionId();
        
        if (userId != null && sessionId != null) {
            sessionUserMap.put(sessionId, userId);
            
            // Broadcast user online status
            PresenceUpdateDTO presenceUpdate = new PresenceUpdateDTO(userId, "ONLINE");
            messagingTemplate.convertAndSend("/topic/presence", presenceUpdate);
        }
    }
    
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        
        if (sessionId != null && sessionUserMap.containsKey(sessionId)) {
            String userId = sessionUserMap.get(sessionId);
            sessionUserMap.remove(sessionId);
            
            // Broadcast user offline status
            PresenceUpdateDTO presenceUpdate = new PresenceUpdateDTO(userId, "OFFLINE");
            messagingTemplate.convertAndSend("/topic/presence", presenceUpdate);
        }
    }
}