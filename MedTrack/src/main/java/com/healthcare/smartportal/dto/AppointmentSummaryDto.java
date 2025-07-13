package com.healthcare.smartportal.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class AppointmentSummaryDto {

    private String appointmentId;
    private String patientName;
    private String contactNumber;
    private String doctorName;
    private String department;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;

    public AppointmentSummaryDto(String appointmentId, String patientName, String contactNumber,
                                  String doctorName, String department,
                                  LocalDate appointmentDate, LocalTime appointmentTime) {
        this.appointmentId = appointmentId;
        this.patientName = patientName;
        this.contactNumber = contactNumber;
        this.doctorName = doctorName;
        this.department = department;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
    }

    // Getters and Setters

    public String getAppointmentId() {
        return appointmentId;
    }

    public String getPatientName() {
        return patientName;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public String getDepartment() {
        return department;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public LocalTime getAppointmentTime() {
        return appointmentTime;
    }
}
