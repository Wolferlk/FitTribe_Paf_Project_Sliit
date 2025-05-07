package com.paf.socialmedia.repository;

import com.paf.socialmedia.document.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    Optional<User> findByProviderAndProviderId(String provider, String providerId);

}
