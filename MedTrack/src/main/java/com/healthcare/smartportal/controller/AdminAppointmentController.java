package com.healthcare.smartportal.controller;

import com.healthcare.smartportal.dto.AppointmentSummaryDto;
import com.healthcare.smartportal.service.AdminAppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/appointments")
@RequiredArgsConstructor
public class AdminAppointmentController {

    private final AdminAppointmentService appointmentService;

    @GetMapping("/filter")
    public List<AppointmentSummaryDto> filterAppointments(
            @RequestParam UUID hospitalId,
            @RequestParam String department,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return appointmentService.getAppointmentsByDepartmentAndDate(hospitalId, department, date);
    }
}
