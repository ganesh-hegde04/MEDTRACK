package com.healthcare.smartportal.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
public class Hospital {

    @Id
    @Column(columnDefinition = "BINARY(16)", nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String location;

    @Column(unique = true, nullable = false)
    private String contact;

    private double latitude;
    private double longitude;

    @Column(nullable = false, unique = true)
    private String email;

    // ✅ Required by JPA and used by services
    public Hospital() {
    }

    public Hospital(String name,
                    String location,
                    String contact,
                    double latitude,
                    double longitude,
                    String email) {
        this.name = name;
        this.location = location;
        this.contact = contact;
        this.latitude = latitude;
        this.longitude = longitude;
        this.email = email;
    }

    // ✅ UUID generation in Java (TiDB-safe)
    @PrePersist
    private void generateId() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }
}
