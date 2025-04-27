package com.paf.socialmedia.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.Set;
import java.util.HashSet;

@Document(collection = "messages")
public class Message {
    
    @Id
    private String id;
    private String senderId;
    private String conversationId;
    private String content;
    private Date timestamp;
    private Set<String> readBy;
    
    public Message() {
        this.readBy = new HashSet<>();
    }
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getSenderId() {
        return senderId;
    }
    
    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }
    
    public String getConversationId() {
        return conversationId;
    }
    
    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public Date getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }
    
    public Set<String> getReadBy() {
        return readBy;
    }
    
    public void setReadBy(Set<String> readBy) {
        this.readBy = readBy;
    }
    
    public void markAsReadBy(String userId) {
        this.readBy.add(userId);
    }
    
    public boolean isReadBy(String userId) {
        return this.readBy.contains(userId);
    }
}