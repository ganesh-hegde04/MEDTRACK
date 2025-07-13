package com.healthcare.smartportal.model;
import jakarta.persistence.*;

@Entity
public class BloodInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bloodGroup;
    private int quantity;

    @ManyToOne
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    // Constructors
    public BloodInventory() {
    }

    public BloodInventory(String bloodGroup, int quantity, Hospital hospital) {
        this.bloodGroup = bloodGroup;
        this.quantity = quantity;
        this.hospital = hospital;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Hospital getHospital() {
        return hospital;
    }

    public void setHospital(Hospital hospital) {
        this.hospital = hospital;
    }

    // toString method for easy debugging
    @Override
    public String toString() {
        return "BloodInventory{" +
                "id=" + id +
                ", bloodGroup='" + bloodGroup + '\'' +
                ", quantity=" + quantity +
                ", hospital=" + (hospital != null ? hospital.getId() : null) +
                '}';
    }
}

