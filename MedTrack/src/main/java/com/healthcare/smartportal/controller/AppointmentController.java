package com.healthcare.smartportal.controller;

import com.healthcare.smartportal.dto.AppointmentRequest;
import com.healthcare.smartportal.dto.AppointmentResponse;
import com.healthcare.smartportal.dto.HospitalSearchDTO;
import com.healthcare.smartportal.model.Appointment;
import com.healthcare.smartportal.model.Hospital;
import com.healthcare.smartportal.repository.DoctorRepository;
import com.healthcare.smartportal.repository.HospitalRepository;
import com.healthcare.smartportal.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final HospitalRepository hospitalRepo; 
    private final DoctorRepository doctorRepo;

    // ✅ Book Appointment
    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(@RequestBody AppointmentRequest request) {
        try {
            Appointment appointment = appointmentService.bookAppointment(
                request.getUserPhone(),
                request.getHospitalName(), 
                request.getDepartment(),      
                request.getDoctorName(),    
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

    // ✅ Reschedule
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

    // ✅ Cancel
    @PatchMapping("/cancel/{appointmentId}")
    public ResponseEntity<?> cancelAppointment(@PathVariable String appointmentId) {
        try {
            appointmentService.cancelAppointment(appointmentId);
            return ResponseEntity.ok("Appointment cancelled.");
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // ✅ Cancel by hospital
    @PostMapping("/cancel-by-hospital/{appointmentId}")
    public ResponseEntity<String> cancelByHospital(
            @PathVariable String appointmentId,
            @RequestParam(required = false, defaultValue = "Cancelled by hospital") String reason) {
        appointmentService.cancelByHospitalWithNotification(appointmentId, reason);
        return ResponseEntity.ok("Appointment cancelled by hospital successfully.");
    }

    // ✅ Search Hospitals with departments
    @GetMapping("/search-hospitals")
    public ResponseEntity<List<HospitalSearchDTO>> searchHospitals(
            @RequestParam(name = "search", required = false, defaultValue = "") String search) {

        List<Hospital> hospitals = hospitalRepo.findByNameContainingIgnoreCase(search);

        List<HospitalSearchDTO> dtos = hospitals.stream().map(hospital -> {
            List<String> departments = doctorRepo.findDistinctDepartmentsByHospital(hospital);
            return new HospitalSearchDTO(
                    hospital.getId(),
                    hospital.getName(),
                    hospital.getLocation(),
                    departments
            );
        }).toList();

        return ResponseEntity.ok(dtos);
    }

    // ✅ Get Departments by Hospital
    @GetMapping("/{hospitalName}/departments")
    public ResponseEntity<List<String>> getDepartmentsByHospital(@PathVariable String hospitalName) {
        Hospital hospital = hospitalRepo.findByNameIgnoreCase(hospitalName)
                .orElseThrow(() -> new RuntimeException("Hospital not found: " + hospitalName));

        List<String> departments = doctorRepo.findDistinctDepartmentsByHospital(hospital);
        return ResponseEntity.ok(departments);
    }

    // ✅ Get Doctors by Department and Hospital
    @GetMapping("/by-department")
    public ResponseEntity<List<String>> getDoctorsByDepartmentAndHospital(
            @RequestParam String hospitalName,
            @RequestParam String department) {

        Hospital hospital = hospitalRepo.findByNameIgnoreCase(hospitalName)
                .orElseThrow(() -> new RuntimeException("Hospital not found: " + hospitalName));

        List<String> doctorNames = doctorRepo.findDoctorNamesByDepartmentAndHospital(department, hospital);
        return ResponseEntity.ok(doctorNames);
    }
}
