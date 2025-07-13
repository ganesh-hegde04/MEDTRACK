package com.healthcare.smartportal.controller;

import com.healthcare.smartportal.dto.AppointmentRequest;
import com.healthcare.smartportal.dto.AppointmentResponse;
import com.healthcare.smartportal.model.Appointment;
import com.healthcare.smartportal.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;

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
                    appointment.getHospital().getName()
            );

            return ResponseEntity.ok(response);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PatchMapping("/reschedule/{appointmentId}")
    public ResponseEntity<?> rescheduleAppointment(
            @PathVariable String appointmentId,
            @RequestParam LocalDate newDate,
            @RequestParam LocalTime newTime) {
        try {
            Appointment updated = appointmentService.rescheduleAppointment(appointmentId, newDate, newTime);
            return ResponseEntity.ok("Rescheduled: " + updated.getAppointmentId());
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PatchMapping("/cancel/{appointmentId}")
    public ResponseEntity<?> cancelAppointment(@PathVariable String appointmentId) {
        try {
            appointmentService.cancelAppointment(appointmentId);
            return ResponseEntity.ok("Appointment cancelled.");
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/cancel-by-hospital/{appointmentId}")
public ResponseEntity<String> cancelByHospital(
        @PathVariable String appointmentId,
        @RequestParam(required = false, defaultValue = "Cancelled by hospital") String reason) {
    appointmentService.cancelByHospitalWithNotification(appointmentId, reason);
    return ResponseEntity.ok("Appointment cancelled by hospital successfully.");
}

    }

