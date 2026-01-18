package com.healthcare.smartportal.repository;

import com.healthcare.smartportal.model.MedicalReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MedicalReportRepository extends JpaRepository<MedicalReport, UUID> {
    Optional<MedicalReport> findByPatientEmailAndFileName(String email, String fileName);

  @Query("SELECT r FROM MedicalReport r WHERE r.patientEmail = :email ORDER BY r.uploadedAt DESC")
List<MedicalReport> findReports(@Param("email") String email);



}
