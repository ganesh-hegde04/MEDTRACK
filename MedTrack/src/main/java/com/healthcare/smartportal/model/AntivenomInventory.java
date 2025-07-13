package com.healthcare.smartportal.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import java.util.UUID;

@Entity
public class AntivenomInventory {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false)
    private Hospital hospital;

    @ManyToOne(optional = false)
    private Animal animal;

    private int quantity;

    // Default constructor
    public AntivenomInventory() {}

    // Constructor with fields
    public AntivenomInventory(Hospital hospital, Animal animal, int quantity) {
        this.hospital = hospital;
        this.animal = animal;
        this.quantity = quantity;
    }

    // Getters and Setters
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

    public Animal getAnimal() {
        return animal;
    }

    public void setAnimal(Animal animal) {
        this.animal = animal;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
