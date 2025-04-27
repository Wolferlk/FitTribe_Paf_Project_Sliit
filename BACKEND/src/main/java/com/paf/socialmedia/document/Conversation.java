package com.paf.socialmedia.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Date;

@Document(collection = "conversations")
public class Conversation {
    
    @Id
    private String id;
    private List<User> participants;
    private String lastMessage;
    private Date lastMessageTime;
    
    public Conversation() {
    }
    
    public Conversation(List<User> participants) {
        this.participants = participants;
    }
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public List<User> getParticipants() {
        return participants;
    }
    
    public void setParticipants(List<User> participants) {
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
}