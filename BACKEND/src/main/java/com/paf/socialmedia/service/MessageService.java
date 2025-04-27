package com.paf.socialmedia.service;

import com.paf.socialmedia.document.Message;
import com.paf.socialmedia.dto.MessageDTO;
import com.paf.socialmedia.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private ConversationService conversationService;
    
    public List<MessageDTO> getMessagesForConversation(String conversationId, String currentUserId) {
        List<Message> messages = messageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
        
        return messages.stream()
                .map(message -> convertToDTO(message, currentUserId))
                .collect(Collectors.toList());
    }
    
    public MessageDTO saveMessage(MessageDTO messageDTO) {
        Message message = new Message();
        message.setSenderId(messageDTO.getSenderId());
        message.setConversationId(messageDTO.getConversationId());
        message.setContent(messageDTO.getContent());
        
        // Set current timestamp if not provided
        Date timestamp = messageDTO.getTimestamp() != null ? messageDTO.getTimestamp() : new Date();
        message.setTimestamp(timestamp);
        
        // Mark as read by sender
        message.markAsReadBy(messageDTO.getSenderId());
        
        Message savedMessage = messageRepository.save(message);
        
        // Update the conversation's last message
        conversationService.updateLastMessage(
                messageDTO.getConversationId(), 
                messageDTO.getContent(), 
                timestamp);
        
        return convertToDTO(savedMessage, messageDTO.getSenderId());
    }
    
    public void markMessagesAsRead(String conversationId, String userId) {
        List<Message> unreadMessages = messageRepository.findUnreadMessagesInConversation(conversationId, userId);
        
        unreadMessages.forEach(message -> {
            message.markAsReadBy(userId);
            messageRepository.save(message);
        });
    }
    
    private MessageDTO convertToDTO(Message message, String currentUserId) {
        MessageDTO dto = new MessageDTO();
        dto.setId(message.getId());
        dto.setSenderId(message.getSenderId());
        dto.setConversationId(message.getConversationId());
        dto.setContent(message.getContent());
        dto.setTimestamp(message.getTimestamp());
        dto.setRead(message.isReadBy(currentUserId));
        
        return dto;
    }
}