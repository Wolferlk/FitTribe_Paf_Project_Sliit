package com.paf.socialmedia.dto;

import lombok.Data;

@Data
public class MessageDTO {
    private String senderId;
    private String receiverId;
    private String content;
    private String timestamp; // Add this line

}
