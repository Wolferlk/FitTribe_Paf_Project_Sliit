package com.paf.socialmedia.dto;

import com.paf.socialmedia.document.User;
import java.util.List;
import java.util.Date;

public class ConversationDTO {
    private String id;
    private List<UserDTO> participants;
    private String lastMessage;
    private Date lastMessageTime;
    private int unreadCount;
    
    public ConversationDTO() {
    }
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public List<UserDTO> getParticipants() {
        return participants;
    }
    
    public void setParticipants(List<UserDTO> participants) {
        this.participants = participants;
    }
    
    public String getLastMessage() {
        return lastMessage;
    }
    
    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }
    
    public Date getLastMessageTime() {
        return lastMessageTime;
    }
    
    public void setLastMessageTime(Date lastMessageTime) {
        this.lastMessageTime = lastMessageTime;
    }
    
    public int getUnreadCount() {
        return unreadCount;
    }
    
    public void setUnreadCount(int unreadCount) {
        this.unreadCount = unreadCount;
    }
}