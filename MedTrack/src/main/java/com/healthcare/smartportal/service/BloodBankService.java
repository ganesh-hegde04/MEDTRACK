package com.healthcare.smartportal.service;

import com.healthcare.smartportal.model.BloodInventory;
import com.healthcare.smartportal.model.Hospital;
import com.healthcare.smartportal.repository.BloodInventoryRepository;
import com.healthcare.smartportal.util.GeoUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BloodBankService {

    @Autowired
    private BloodInventoryRepository bloodInventoryRepository;

    public List<Hospital> findHospitalsWithBlood(String bloodGroup, Double userLat, Double userLon) {
        bloodGroup = bloodGroup.trim();

        List<Double> searchRadii = Arrays.asList(5.0, 10.0, 15.0, 20.0, 25.0, 50.0);
        List<Hospital> results = new ArrayList<>();

        List<BloodInventory> inventoryList;

        if (bloodGroup.endsWith("+") || bloodGroup.endsWith("-")) {
            inventoryList = bloodInventoryRepository.findByBloodGroup(bloodGroup);
        } else {
            inventoryList = bloodInventoryRepository.findByBloodGroupStartingWith(bloodGroup);
        }

        // If location not provided, return all hospitals with quantity > 0
        if (userLat == null || userLon == null) {
            for (BloodInventory inventory : inventoryList) {
                if (inventory.getQuantity() > 0) {
                    Hospital h = inventory.getHospital();
                    if (!results.contains(h)) {
                        results.add(h);
                    }
                }
            }
            return results;
        }

        // Search progressively in increasing radius steps up to 50 km
        for (double radius : searchRadii) {
            System.out.println("Searching hospitals within radius: " + radius + " km");
            for (BloodInventory inventory : inventoryList) {
                if (inventory.getQuantity() > 0) {
                    Hospital h = inventory.getHospital();
                    double distance = GeoUtils.distance(userLat, userLon, h.getLatitude(), h.getLongitude());
                    System.out.println("Checking hospital: " + h.getName() + ", Distance: " + distance + " km");

                    if (distance <= radius && !results.contains(h)) {
                        results.add(h);
                        System.out.println("Added hospital: " + h.getName() + " at distance: " + distance + " km");
                    }
                }
            }
            if (!results.isEmpty()) {
                System.out.println("Found hospitals at radius: " + radius + " km");
                return results;  // return immediately once found any
            }
        }

        // If no hospital found within 50 km, search up to 100 km and sort by nearest
        System.out.println("No hospitals found within 50 km. Searching within 100 km sorted by nearest.");

        List<HospitalDistance> hospitalDistances = new ArrayList<>();

        for (BloodInventory inventory : inventoryList) {
            if (inventory.getQuantity() > 0) {
                Hospital h = inventory.getHospital();
                double distance = GeoUtils.distance(userLat, userLon, h.getLatitude(), h.getLongitude());
                if (distance <= 100) {
                    hospitalDistances.add(new HospitalDistance(h, distance));
                }
            }
        }

        if (hospitalDistances.isEmpty()) {
            System.out.println("No hospital having " + bloodGroup + " blood group found within 100 km radius.");
            return results; // empty list
        }

        // Sort hospitals by distance ascending
        hospitalDistances.sort(Comparator.comparingDouble(hd -> hd.distance));

        List<Hospital> sortedHospitals = new ArrayList<>();
        for (HospitalDistance hd : hospitalDistances) {
            sortedHospitals.add(hd.hospital);
            System.out.println("Hospital within 100 km: " + hd.hospital.getName() + " at distance: " + hd.distance + " km");
        }

        return sortedHospitals;
    }

    // Helper class to pair hospital with its distance
    private static class HospitalDistance {
        Hospital hospital;
        double distance;

        HospitalDistance(Hospital hospital, double distance) {
            this.hospital = hospital;
            this.distance = distance;
        }
    }
}
