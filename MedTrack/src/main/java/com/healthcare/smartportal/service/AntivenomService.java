package com.healthcare.smartportal.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healthcare.smartportal.model.Animal;
import com.healthcare.smartportal.model.AntivenomInventory;
import com.healthcare.smartportal.model.Hospital;
import com.healthcare.smartportal.repository.AnimalRepository;
import com.healthcare.smartportal.repository.AntivenomInventoryRepository;
import com.healthcare.smartportal.util.GeoUtils;

import lombok.extern.slf4j.Slf4j;
@Slf4j
@Service
public class AntivenomService {

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private AntivenomInventoryRepository antivenomInventoryRepository;

    // Method to get venomous animals
    public List<Animal> getVenomousAnimals() {
        return animalRepository.findAll();
    }

    // Method to get hospitals with antivenom based on the animal and user location
    public List<Hospital> getHospitalsWithAntivenom(String animalName, double userLat, double userLon) {
        List<Double> radiusSteps = Arrays.asList(5.0, 10.0, 25.0, 30.0, 40.0, 50.0);
        List<Hospital> nearbyHospitals = new ArrayList<>();

        // Find the animal by name
        Optional<Animal> animalOpt = animalRepository.findByName(animalName);
        if (!animalOpt.isPresent()) {
            throw new RuntimeException("Animal not found!");
        }
        Animal animal = animalOpt.get();

        // Fetch antivenoms available for the animal by its ID
        List<AntivenomInventory> inventoryList = antivenomInventoryRepository.findByAnimalId(animal.getId());

        // Collect hospitals cumulatively for all radius steps (5 to 50 km)
        for (double radius : radiusSteps) {
            log.debug("Searching hospitals within radius: " + radius + " km");

            for (AntivenomInventory inventory : inventoryList) {
                Hospital hospital = inventory.getHospital();
                double distance = GeoUtils.distance(userLat, userLon, hospital.getLatitude(), hospital.getLongitude());

                log.debug("Checking hospital: " + hospital.getName() + ", Distance: " + distance + " km");

                if (distance <= radius && !nearbyHospitals.contains(hospital)) {
                    nearbyHospitals.add(hospital);
                    log.debug("Added hospital: " + hospital.getName() + " at distance: " + distance + " km");
                }
            }
        }

        // Return all hospitals within 50 km if any found
        if (!nearbyHospitals.isEmpty()) {
            log.debug("Hospitals found within 50 km.");
            return nearbyHospitals;
        }

        // Else check within 100 km and sort by nearest
        log.debug("No hospitals found within 50 km. Searching within 100 km and sorting by nearest.");

        List<HospitalDistance> hospitalDistances = new ArrayList<>();

        for (AntivenomInventory inventory : inventoryList) {
            Hospital hospital = inventory.getHospital();
            double distance = GeoUtils.distance(userLat, userLon, hospital.getLatitude(), hospital.getLongitude());
            if (distance <= 100) {
                hospitalDistances.add(new HospitalDistance(hospital, distance));
            }
        }

        if (hospitalDistances.isEmpty()) {
            log.debug("No hospitals with antivenom for '" + animalName + "' found within 100 km radius.");
            return nearbyHospitals; // empty list
        }

        // Sort by distance ascending
        hospitalDistances.sort((a, b) -> Double.compare(a.distance, b.distance));

        // Extract hospitals from sorted distances
        List<Hospital> sortedHospitals = new ArrayList<>();
        for (HospitalDistance hd : hospitalDistances) {
            sortedHospitals.add(hd.hospital);
            log.debug("Hospital within 100 km: " + hd.hospital.getName() + " at distance: " + hd.distance + " km");
        }

        return sortedHospitals;
    }

    // Helper class to hold hospital and distance
    private static class HospitalDistance {
        Hospital hospital;
        double distance;

        HospitalDistance(Hospital hospital, double distance) {
            this.hospital = hospital;
            this.distance = distance;
        }
    }
}
