package com.paf.socialmedia.repository;

import com.paf.socialmedia.document.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByConversationId(Long conversationId);
    List<Message> findByConversationIdAndReadFalseAndSenderIdNot(Long conversationId, Long userId);
}
