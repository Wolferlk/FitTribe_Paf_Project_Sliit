package com.paf.socialmedia.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.security.PrivateKey;
import java.util.Date;

@Component
public class JwtUtil {

    @Autowired
    private KeyUtils keyUtils;

    private final long EXPIRATION_TIME = 86400000; // 1 day in ms

    public String generateAccessToken(String email) {
        PrivateKey privateKey = keyUtils.getAccessTokenPrivateKey();

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.RS256, privateKey)
                .compact();
    }

    public String generateRefreshToken(String email) {
        PrivateKey privateKey = keyUtils.getRefreshTokenPrivateKey();

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + (EXPIRATION_TIME * 7))) // 7 days
                .signWith(SignatureAlgorithm.RS256, privateKey)
                .compact();
    }
}
