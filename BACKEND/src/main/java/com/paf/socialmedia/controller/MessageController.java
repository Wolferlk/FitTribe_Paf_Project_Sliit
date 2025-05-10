package com.paf.socialmedia.controller;

import com.paf.socialmedia.document.Message;
import com.paf.socialmedia.dto.MessageDTO;
import com.paf.socialmedia.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @PostMapping
    public Message sendMessage(@RequestBody MessageDTO messageDTO) {
    Message message = new Message();
    message.setSenderId(messageDTO.getSenderId());
    message.setReceiverId(messageDTO.getReceiverId());
    message.setContent(messageDTO.getContent());
    // Parse timestamp if provided, otherwise use current time
    if (messageDTO.getTimestamp() != null) {
        message.setTimestamp(Instant.parse(messageDTO.getTimestamp()));
    }
    return messageRepository.save(message);
}

    
}
