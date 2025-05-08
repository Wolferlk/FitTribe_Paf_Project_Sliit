package com.paf.socialmedia.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatMessageDTO {
    private Long senderId;
    private Long conversationId;
    private String content;
    private LocalDateTime timestamp;
}
