package com.healthcare.smartportal.service;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Jwts;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class TokenService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    private Key SECRET_KEY;

    @PostConstruct
    public void init() {
        this.SECRET_KEY = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }
    /**
     * Generates a JWT token containing the phone as subject and email as a claim.
     * The token is valid for 7 days.
     */
    public String generateToken(String phone, String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

        return Jwts.builder()
                .setSubject(phone)
                .claim("email", email)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Validates if the token is correctly signed and the subject matches the given phone number.
     */
    public boolean isTokenValid(String token, String phone) {
        try {
            String subject = extractPhoneFromToken(token);
            return phone.equals(subject);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Extracts the phone (subject) from the JWT token.
     */
    public String extractPhoneFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * Extracts the email claim from the JWT token.
     */
    public String extractEmailFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("email", String.class);
    }

    @PostConstruct
public void test() {
    System.out.println("JWT secret length = " + jwtSecret.length());
}

}
