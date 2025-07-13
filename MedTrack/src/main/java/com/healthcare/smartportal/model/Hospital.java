package com.healthcare.smartportal.model;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
public class Hospital {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    private String name;

    @Column(unique = true)
    private String location;

    @Column(unique = true)
    private String contact;

    private double latitude;
    private double longitude;

    public Hospital() {}

    public Hospital(String name, String location, String contact, double latitude, double longitude) {
        this.name = name;
        this.location = location;
        this.contact = contact;
        this.latitude = latitude;
        this.longitude = longitude;
    }

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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
}
