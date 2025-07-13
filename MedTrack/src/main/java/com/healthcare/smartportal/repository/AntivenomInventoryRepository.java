package com.healthcare.smartportal.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.healthcare.smartportal.model.AntivenomInventory;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AntivenomInventoryRepository extends JpaRepository<AntivenomInventory, UUID> {
    List<AntivenomInventory> findByAnimalId(UUID animalId);

    List<AntivenomInventory> findByHospitalId(UUID hospitalId);

    Optional<AntivenomInventory> findByHospitalIdAndAnimalId(UUID hospitalId, UUID animalId);

}
