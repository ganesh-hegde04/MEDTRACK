// File: src/main/java/com/healthcare/smartportal/dto/DoctorRequest.java
package com.healthcare.smartportal.dto;

import java.util.UUID;

public class DoctorRequest {
    private String name;
    private String department;
    private int experience;
    private UUID hospitalId;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getdepartment() { return department; }
    public void setdepartment(String department) { this.department = department; }

    public int getExperience() { return experience; }
    public void setExperience(int experience) { this.experience = experience; }

    public UUID getHospitalId() { return hospitalId; }
    public void setHospitalId(UUID hospitalId) { this.hospitalId = hospitalId; }
}
