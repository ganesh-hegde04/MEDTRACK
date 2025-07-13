package com.healthcare.smartportal.dto;

import com.healthcare.smartportal.model.AppointmentStatus;

import java.time.LocalDate;
import java.time.LocalTime;

public class AppointmentResponse {

    private String appointmentId;
    private LocalDate date;
    private LocalTime time;
    private AppointmentStatus status;
    private String doctorName;
    private String hospitalName;

    // ✅ Add this constructor
    public AppointmentResponse(String appointmentId, LocalDate date, LocalTime time, AppointmentStatus status, String doctorName, String hospitalName) {
        this.appointmentId = appointmentId;
        this.date = date;
        this.time = time;
        this.status = status;
        this.doctorName = doctorName;
        this.hospitalName = hospitalName;
    }

    // Getters and setters
    public String getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(String appointmentId) {
        this.appointmentId = appointmentId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }
}
