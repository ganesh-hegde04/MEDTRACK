package com.healthcare.smartportal.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class AppointmentRequest {
    private String userPhone;
    private UUID doctorId;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
}
