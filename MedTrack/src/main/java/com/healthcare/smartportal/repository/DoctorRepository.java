package com.healthcare.smartportal.repository;

import com.healthcare.smartportal.model.Doctor;
import com.healthcare.smartportal.model.Hospital;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    // check if a doctor exists by name and Hospital
    Optional<Doctor> findByNameAndDepartmentAndHospital(String name, String department, Hospital hospital);
    
    @Query("SELECT DISTINCT d.department FROM Doctor d WHERE d.hospital = :hospital")
List<String> findDistinctDepartmentsByHospital(@Param("hospital") Hospital hospital);

@Query("SELECT d.name FROM Doctor d WHERE d.department = :department AND d.hospital = :hospital")
List<String> findDoctorNamesByDepartmentAndHospital(@Param("department") String department,
                                                    @Param("hospital") Hospital hospital);



}
