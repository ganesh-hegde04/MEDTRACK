package com.healthcare.smartportal.service;

import com.healthcare.smartportal.dto.AppointmentSummaryDto;
import com.healthcare.smartportal.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminAppointmentService {

    private final AppointmentRepository appointmentRepository;

    public List<AppointmentSummaryDto> getAppointmentsByDepartmentAndDate(
            UUID hospitalId, String department, LocalDate date) {
        return appointmentRepository.findAppointmentsByDepartmentAndDate(department, date, hospitalId);
    }
}
