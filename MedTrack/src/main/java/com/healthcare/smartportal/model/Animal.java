package com.healthcare.smartportal.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "animal")
public class Animal {

    @Id
    @Column(name = "id", columnDefinition = "BINARY(16)", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "photo_url")
    private String photoUrl;

    // JPA requires no-args constructor
    protected Animal() {
    }

    public Animal(String name) {
        this.name = name;
    }

    public Animal(String name, String photoUrl) {
        this.name = name;
        this.photoUrl = photoUrl;
    }

    @PrePersist
    private void generateId() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
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
