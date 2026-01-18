package com.healthcare.smartportal.service;

import org.springframework.stereotype.Service;

import com.healthcare.smartportal.dto.DoctorRequest;
import com.healthcare.smartportal.model.Doctor;
import com.healthcare.smartportal.model.Hospital;
import com.healthcare.smartportal.repository.DoctorRepository;
import com.healthcare.smartportal.repository.HospitalRepository;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final HospitalRepository hospitalRepository;

    public DoctorService(DoctorRepository doctorRepository, HospitalRepository hospitalRepository) {
        this.doctorRepository = doctorRepository;
        this.hospitalRepository = hospitalRepository;
    }

    public Doctor createDoctor(DoctorRequest request) {
        Hospital hospital = hospitalRepository.findById(request.getHospitalId())
                .orElseThrow(() -> new RuntimeException("Hospital not found"));

        Doctor doctor = new Doctor();
        doctor.setName(request.getName());
        doctor.setDepartment(request.getDepartment()); 
        doctor.setExperience(request.getExperience());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setHospital(hospital);

        return doctorRepository.save(doctor);
    }
}
