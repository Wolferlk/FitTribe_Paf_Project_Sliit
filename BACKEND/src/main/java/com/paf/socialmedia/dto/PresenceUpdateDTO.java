package com.paf.socialmedia.dto;

public class PresenceUpdateDTO {
    private String userId;
    private String status; // "ONLINE" or "OFFLINE"
    
    public PresenceUpdateDTO() {
    }
    
    public PresenceUpdateDTO(String userId, String status) {
        this.userId = userId;
        this.status = status;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}