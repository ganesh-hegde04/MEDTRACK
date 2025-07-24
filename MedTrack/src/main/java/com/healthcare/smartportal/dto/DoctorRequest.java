package com.healthcare.smartportal.dto;

import java.util.UUID;

public class DoctorRequest {
    private String name;
    private String department;
    private int experience;
    private UUID hospitalId;
    private String specialization; 

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public int getExperience() { return experience; }
    public void setExperience(int experience) { this.experience = experience; }

    public UUID getHospitalId() { return hospitalId; }
    public void setHospitalId(UUID hospitalId) { this.hospitalId = hospitalId; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
}
