package com.paf.socialmedia.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "messages")
@Data
public class Message {

    @Id
    private String id; // Use String for MongoDB ObjectId

    private Long conversationId;
    private Long senderId;
    private String content;
    private LocalDateTime timestamp;
    private boolean read;
}
