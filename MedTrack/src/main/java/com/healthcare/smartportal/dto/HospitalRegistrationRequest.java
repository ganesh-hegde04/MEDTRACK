package com.healthcare.smartportal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class HospitalRegistrationRequest {

    private String name;
    private String location;
    private String contact;
    private double latitude;
    private double longitude;
    private String email;

    @JsonProperty("username")
    private String username;

    @JsonProperty("adminPassword")
    private String adminPassword;

    public HospitalRegistrationRequest() {}

    public HospitalRegistrationRequest(String name, String location, String contact,
                                       double latitude, double longitude,
                                       String email,
                                       String username, String adminPassword) {
        this.name = name;
        this.location = location;
        this.contact = contact;
        this.latitude = latitude;
        this.longitude = longitude;
        this.email = email;
        this.username = username;
        this.adminPassword = adminPassword;
    }

    // Getters and Setters for all fields

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

   public String getUsername() { return username;}

public void setUsername(String username) {this.username = username;}


    public String getAdminPassword() { return adminPassword; }
    public void setAdminPassword(String adminPassword) { this.adminPassword = adminPassword; }


    @Override
    public String toString() {
        return "HospitalRegistrationRequest{" +
                "name='" + name + '\'' +
                ", location='" + location + '\'' +
                ", contact='" + contact + '\'' +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", email='" + email + '\'' + // ✅ Add toString
                ", username='" + username + '\'' +
                '}';
    }
}
