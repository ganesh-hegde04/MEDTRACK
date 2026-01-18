package com.healthcare.smartportal.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;

import java.util.UUID;

@Entity
public class HospitalAdmin {

    @Id
    @Column(name = "id", columnDefinition = "BINARY(16)", nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    // ✅ Required by JPA and service code
    public HospitalAdmin() {
    }

    public HospitalAdmin(Hospital hospital, String username, String password, String email) {
        this.hospital = hospital;
        this.username = username;
        this.password = password;
        this.email = email;
    }

    // ✅ UUID generation in Java 
    @PrePersist
    private void generateId() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }

    // Getters & Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Hospital getHospital() {
        return hospital;
    }

    public void setHospital(Hospital hospital) {
        this.hospital = hospital;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }
 
    public void setPassword(String password) {
        this.password = password;
    }
 
    public String getEmail() {
        return email;
    }
 
    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "HospitalAdmin{" +
                "id=" + id +
                ", hospital=" + (hospital != null ? hospital.getId() : null) +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
