package com.paf.socialmedia.security;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtDecoder jwtDecoder;
    private final JwtToUserConverter jwtToUserConverter;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7); // Remove "Bearer "

        try {
            Jwt jwt = jwtDecoder.decode(token); // Decode the JWT
            AbstractAuthenticationToken authToken = jwtToUserConverter.convert(jwt); // Convert JWT to Authentication Token
            SecurityContextHolder.getContext().setAuthentication(authToken); // Set the authentication in the SecurityContext
        } catch (JwtException e) {
            logger.warn("Invalid JWT: {}", e);
        }

        filterChain.doFilter(request, response); // Continue with the filter chain
    }

}
