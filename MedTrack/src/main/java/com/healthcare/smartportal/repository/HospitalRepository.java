package com.healthcare.smartportal.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import com.healthcare.smartportal.model.Hospital;

public interface HospitalRepository extends JpaRepository<Hospital, UUID> {
boolean existsByLocation(String location);
boolean existsByContact(String contact);
boolean existsByLatitudeAndLongitude(double latitude, double longitude);

}
