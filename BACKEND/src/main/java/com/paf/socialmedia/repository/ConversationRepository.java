package com.paf.socialmedia.repository;

import com.paf.socialmedia.document.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends MongoRepository<Conversation, String> {
    
    @Query("{ 'participants._id': ?0 }")
    List<Conversation> findByParticipantId(String userId);
    
    @Query("{ 'participants._id': { $all: [?0, ?1] } }")
    Optional<Conversation> findByParticipantIds(String userId1, String userId2);
}