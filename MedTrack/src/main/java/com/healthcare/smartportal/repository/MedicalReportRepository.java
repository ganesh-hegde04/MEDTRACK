package com.healthcare.smartportal.repository;

import com.healthcare.smartportal.model.MedicalReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface MedicalReportRepository extends JpaRepository<MedicalReport, UUID> {
    Optional<MedicalReport> findByPatientEmailAndFileName(String email, String fileName);

}
