package com.healthcare.smartportal.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class AppointmentRequest {
    private String userPhone;
    private String doctorName;
    private String department;
    private String hospitalName;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;

    // Getters and Setters
    public String getUserPhone() { return userPhone; }
    public void setUserPhone(String userPhone) { this.userPhone = userPhone; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public LocalTime getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(LocalTime appointmentTime) { this.appointmentTime = appointmentTime; }
}
