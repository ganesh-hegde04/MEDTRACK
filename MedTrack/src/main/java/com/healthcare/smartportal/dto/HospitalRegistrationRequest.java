package com.healthcare.smartportal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO for Hospital registration along with admin details.
 */
public class HospitalRegistrationRequest {

    private String name;
    private String location;
    private String contact;
    private double latitude;
    private double longitude;

    @JsonProperty("username")
    private String username;

    @JsonProperty("adminPassword")
    private String adminPassword;

    public HospitalRegistrationRequest() {
    }

    public HospitalRegistrationRequest(String name, String location, String contact,
                                       double latitude, double longitude,
                                       String username, String adminPassword) {
        this.name = name;
        this.location = location;
        this.contact = contact;
        this.latitude = latitude;
        this.longitude = longitude;
        this.username = username;
        this.adminPassword = adminPassword;
    }

    // Getters and Setters

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

    public String getusername() {
        return username;
    }

    public void setusername(String username) {
        this.username = username;
    }

    public String getAdminPassword() {
        return adminPassword;
    }

    public void setAdminPassword(String adminPassword) {
        this.adminPassword = adminPassword;
    }

    @Override
    public String toString() {
        return "HospitalRegistrationRequest{" +
                "name='" + name + '\'' +
                ", location='" + location + '\'' +
                ", contact='" + contact + '\'' +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", username='" + username + '\'' +
                '}';
    }
}
