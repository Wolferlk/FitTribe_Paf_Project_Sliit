package com.paf.socialmedia.repository;

import com.paf.socialmedia.document.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    
    List<Message> findByConversationIdOrderByTimestampAsc(String conversationId);
    
    @Query("{ 'conversationId': ?0, 'readBy': { $nin: [?1] } }")
    List<Message> findUnreadMessagesInConversation(String conversationId, String userId);
    
    long countByConversationIdAndReadByNotContaining(String conversationId, String userId);
}