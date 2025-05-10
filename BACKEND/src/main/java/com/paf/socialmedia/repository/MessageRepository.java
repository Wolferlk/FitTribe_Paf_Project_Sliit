package com.paf.socialmedia.repository;

import com.paf.socialmedia.document.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    @Query("{$or: [ " +
           "{ $and: [ {'senderId': ?0}, {'receiverId': ?1} ] }, " +
           "{ $and: [ {'senderId': ?1}, {'receiverId': ?0} ] } " +
           "]}")
    List<Message> findConversationBetweenUsers(String userId1, String userId2);

    @GetMapping("/conversation/{userId1}/{userId2}")
    public default List<Message> getConversation(@PathVariable String userId1, @PathVariable String userId2) {
    MessageRepository messageRepository = null;
    return messageRepository.findConversationBetweenUsers(userId1, userId2);
}

}