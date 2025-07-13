package com.healthcare.smartportal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.healthcare.smartportal.model.Animal;
import java.util.Optional;
import java.util.UUID;

public interface AnimalRepository extends JpaRepository<Animal, UUID> {
    Optional<Animal> findByName(String name);
}
