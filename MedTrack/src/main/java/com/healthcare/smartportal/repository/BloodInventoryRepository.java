package com.healthcare.smartportal.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import com.healthcare.smartportal.model.BloodInventory;

public interface BloodInventoryRepository extends JpaRepository<BloodInventory, Long> {
    List<BloodInventory> findByBloodGroup(String bloodGroup);

    List<BloodInventory> findByBloodGroupStartingWith(String bloodGroupPrefix);

    Optional<BloodInventory> findByHospitalIdAndBloodGroup(UUID hospitalId, String bloodGroup);

}
