package com.healthcare.smartportal.repository;

import com.healthcare.smartportal.model.HospitalAdmin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface HospitalAdminRepository extends JpaRepository<HospitalAdmin, UUID> {
    Optional<HospitalAdmin> findByUsername(String username);
    boolean existsByUsername(String username);

}
