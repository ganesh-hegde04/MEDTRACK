package com.healthcare.smartportal.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import com.healthcare.smartportal.model.Hospital;

public interface HospitalRepository extends JpaRepository<Hospital, UUID> {

    boolean existsByLocation(String location);
    boolean existsByContact(String contact);
    boolean existsByLatitudeAndLongitude(double latitude, double longitude);

    Optional<Hospital> findByNameIgnoreCase(String name);

    //  method for partial name search (case-insensitive)
    List<Hospital> findByNameContainingIgnoreCase(String name);
}
