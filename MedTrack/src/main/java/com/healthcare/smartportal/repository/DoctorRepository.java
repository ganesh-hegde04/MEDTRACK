package com.healthcare.smartportal.repository;

import com.healthcare.smartportal.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DoctorRepository extends JpaRepository<Doctor, UUID> {

    // Find doctor by name (exact match)
    Optional<Doctor> findByName(String name);

    // Find all doctors with a given department
    List<Doctor> findBydepartment(String department);

    // Find doctor by name and department
    Optional<Doctor> findByNameAndDepartment(String name, String department);

    // Find all doctors in a specific hospital by hospital ID
    List<Doctor> findByHospitalId(UUID hospitalId);
}
