package com.healthcare.smartportal.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.healthcare.smartportal.dto.AppointmentRequest;
import com.healthcare.smartportal.dto.AppointmentResponse;
import com.healthcare.smartportal.model.Appointment;
import com.healthcare.smartportal.service.AppointmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

   @PostMapping("/book")
public ResponseEntity<?> bookAppointment(@RequestBody AppointmentRequest request) {
    try {
        Appointment appointment = appointmentService.bookAppointment(
                request.getUserPhone(),
                request.getDoctorId(),
                request.getAppointmentDate(),
                request.getAppointmentTime()
        );

        AppointmentResponse response = new AppointmentResponse(
                appointment.getAppointmentId(),
                appointment.getAppointmentDate(),
                appointment.getAppointmentTime(),
                appointment.getStatus(),
                appointment.getDoctor().getName(),
                appointment.getDoctor().getHospital().getName()
        );

        return ResponseEntity.ok(response);
    } catch (RuntimeException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}
}
