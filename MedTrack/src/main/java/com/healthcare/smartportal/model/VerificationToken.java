package com.healthcare.smartportal.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class VerificationToken {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public VerificationToken() {}

    public VerificationToken(String email, String code) {
        this.email = email;
        this.code = code;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and setters
    public UUID getId() { return id; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getCode() { return code; }

    public void setCode(String code) { this.code = code; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
