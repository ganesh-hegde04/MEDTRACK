package com.healthcare.smartportal.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthcare.smartportal.dto.DoctorRequest;
import com.healthcare.smartportal.model.Doctor;
import com.healthcare.smartportal.service.DoctorService;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @PostMapping
    public ResponseEntity<Doctor> createDoctor(@RequestBody DoctorRequest request) {
        Doctor doctor = doctorService.createDoctor(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(doctor);
    }
}
