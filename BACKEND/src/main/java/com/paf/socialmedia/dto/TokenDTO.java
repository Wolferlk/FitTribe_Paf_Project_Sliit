package com.paf.socialmedia.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TokenDTO {
    private String userId; // optional alias for 'id'
    private String id; // ID field from OAuth2
    private String username;
    private String email;
    private String token; // general-purpose token (e.g., OAuth2)
    private String type; // e.g., "Bearer"
    private String accessToken; // JWT
    private String refreshToken; // JWT refresh
}
