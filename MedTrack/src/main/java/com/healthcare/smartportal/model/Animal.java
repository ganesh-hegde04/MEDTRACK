package com.healthcare.smartportal.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "animal")
public class Animal {

    @Id
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "photo_url")
    private String photoUrl;

    // Default constructor generates UUID
    public Animal() {
        this.id = UUID.randomUUID();
    }

    // Constructor with name
    public Animal(String name) {
        this.id = UUID.randomUUID();
        this.name = name;
    }

    // Constructor with name and photoUrl
    public Animal(String name, String photoUrl) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.photoUrl = photoUrl;
    }

    // Constructor with all fields
    public Animal(UUID id, String name, String photoUrl) {
        this.id = id;
        this.name = name;
        this.photoUrl = photoUrl;
    }

    // Getters and setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
}
