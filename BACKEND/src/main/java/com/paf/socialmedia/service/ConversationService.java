package com.paf.socialmedia.service;

import com.paf.socialmedia.document.Conversation;
import com.paf.socialmedia.document.User;
import com.paf.socialmedia.dto.ConversationDTO;
import com.paf.socialmedia.dto.UserDTO;
import com.paf.socialmedia.repository.ConversationRepository;
import com.paf.socialmedia.repository.MessageRepository;
import com.paf.socialmedia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ConversationService {
    
    @Autowired
    private ConversationRepository conversationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MessageRepository messageRepository;
    
    public List<ConversationDTO> getConversationsForUser(String userId) {
        List<Conversation> conversations = conversationRepository.findByParticipantId(userId);
        return conversations.stream()
                .map(conversation -> convertToDTO(conversation, userId))
                .collect(Collectors.toList());
    }
    
    public ConversationDTO getOrCreateConversation(String userId1, String userId2) {
        Optional<Conversation> existingConversation = conversationRepository.findByParticipantIds(userId1, userId2);
        
        if (existingConversation.isPresent()) {
            return convertToDTO(existingConversation.get(), userId1);
        } else {
            User user1 = userRepository.findById(userId1).orElseThrow(() -> new RuntimeException("User not found"));
            User user2 = userRepository.findById(userId2).orElseThrow(() -> new RuntimeException("User not found"));
            
            List<User> participants = new ArrayList<>();
            participants.add(user1);
            participants.add(user2);
            
            Conversation newConversation = new Conversation(participants);
            Conversation savedConversation = conversationRepository.save(newConversation);
            
            return convertToDTO(savedConversation, userId1);
        }
    }
    
    private ConversationDTO convertToDTO(Conversation conversation, String currentUserId) {
        ConversationDTO dto = new ConversationDTO();
        dto.setId(conversation.getId());
        
        List<UserDTO> participantDTOs = conversation.getParticipants().stream()
                .map(UserDTO::from)  // Use the static from method from your UserDTO
                .collect(Collectors.toList());
        
        dto.setParticipants(participantDTOs);
        dto.setLastMessage(conversation.getLastMessage());
        dto.setLastMessageTime(conversation.getLastMessageTime());
        
        // Get unread count
        long unreadCount = messageRepository.countByConversationIdAndReadByNotContaining(
                conversation.getId(), currentUserId);
        dto.setUnreadCount((int) unreadCount);
        
        return dto;
    }
    
    public void updateLastMessage(String conversationId, String message, java.util.Date timestamp) {
        Optional<Conversation> conversationOpt = conversationRepository.findById(conversationId);
        if (conversationOpt.isPresent()) {
            Conversation conversation = conversationOpt.get();
            conversation.setLastMessage(message);
            conversation.setLastMessageTime(timestamp);
            conversationRepository.save(conversation);
        }
    }
}