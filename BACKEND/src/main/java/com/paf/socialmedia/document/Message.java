package com.paf.socialmedia.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document
@Data
public class Message {
    @Id
    private String id;
    private String senderId;
    private String receiverId;
    private String content;
    private Instant timestamp = Instant.now();
}
