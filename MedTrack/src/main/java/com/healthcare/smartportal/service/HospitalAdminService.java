package com.healthcare.smartportal.service;

import com.healthcare.smartportal.dto.HospitalRegistrationRequest;
import com.healthcare.smartportal.model.*;
import com.healthcare.smartportal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class HospitalAdminService {

    @Autowired
    private HospitalAdminRepository adminRepo;

    @Autowired
    private HospitalRepository hospitalRepo;

    @Autowired
    private AntivenomInventoryRepository antivenomRepo;

    @Autowired
    private AnimalRepository animalRepo;

    @Autowired
    private BloodInventoryRepository bloodRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ ADD THIS (REQUIRED)
    @Autowired
    private TokenService tokenService;

    // ================= EXISTINGD (UNCHANGED) =================
    public HospitalAdmin register(String username, String password, UUID hospitalId) {
        Optional<Hospital> hospitalOpt = hospitalRepo.findById(hospitalId);
        if (hospitalOpt.isEmpty()) {
            throw new IllegalArgumentException("Hospital not found with ID: " + hospitalId);
        }

        HospitalAdmin admin = new HospitalAdmin();
        admin.setUsername(username);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setHospital(hospitalOpt.get());

        return adminRepo.save(admin);
    }

    // ================= EXISTING LOGIN (UNCHANGED) =================
    public Optional<HospitalAdmin> login(String username, String password) {
        Optional<HospitalAdmin> adminOpt = adminRepo.findByUsername(username);
        if (adminOpt.isPresent()) {
            HospitalAdmin admin = adminOpt.get();
            if (passwordEncoder.matches(password, admin.getPassword())) {
                return Optional.of(admin);
            }
        }
        return Optional.empty();
    }

    // ================= ✅ NEW LOGIN (JWT) =================
    public String loginAndGenerateToken(String username, String password) {

        HospitalAdmin admin = adminRepo.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // ✅ generate JWT
        return tokenService.generateToken(
            admin.getUsername(),
            admin.getEmail()
        );
    }

    // ================= UNCHANGED =================
    public Optional<HospitalAdmin> getAdminByUsername(String username) {
        return adminRepo.findByUsername(username);
    }

    public boolean updateAntivenom(UUID hospitalId, String animalName, int quantity) {
        Optional<Hospital> hospitalOpt = hospitalRepo.findById(hospitalId);
        if (hospitalOpt.isEmpty()) return false;

        Optional<Animal> animalOpt = animalRepo.findByName(animalName);
        if (animalOpt.isEmpty()) return false;

        Hospital hospital = hospitalOpt.get();
        Animal animal = animalOpt.get();

        AntivenomInventory inventory = antivenomRepo
                .findByHospitalIdAndAnimalId(hospitalId, animal.getId())
                .orElseGet(() -> {
                    AntivenomInventory newInventory = new AntivenomInventory();
                    newInventory.setHospital(hospital);
                    newInventory.setAnimal(animal);
                    return newInventory;
                });

        inventory.setQuantity(quantity);
        antivenomRepo.save(inventory);
        return true;
    }

    public boolean updateBlood(UUID hospitalId, String bloodGroup, int quantity) {
        Optional<Hospital> hospitalOpt = hospitalRepo.findById(hospitalId);
        if (hospitalOpt.isEmpty()) return false;

        Hospital hospital = hospitalOpt.get();

        BloodInventory inventory = bloodRepo
                .findByHospitalIdAndBloodGroup(hospitalId, bloodGroup)
                .orElseGet(() -> {
                    BloodInventory newInventory = new BloodInventory();
                    newInventory.setHospital(hospital);
                    newInventory.setBloodGroup(bloodGroup);
                    return newInventory;
                });

        inventory.setQuantity(quantity);
        bloodRepo.save(inventory);
        return true;
    }

    public Hospital registerHospitalAndAdmin(HospitalRegistrationRequest request) {
        if (hospitalRepo.existsByLocation(request.getLocation())) {
            throw new IllegalArgumentException("Location already registered");
        }

        if (hospitalRepo.existsByContact(request.getContact())) {
            throw new IllegalArgumentException("Contact already used");
        }

        if (hospitalRepo.existsByLatitudeAndLongitude(
                request.getLatitude(), request.getLongitude())) {
            throw new IllegalArgumentException("Hospital at this location already exists");
        }

        if (adminRepo.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already taken");
        }

        Hospital hospital = new Hospital();
        hospital.setName(request.getName());
        hospital.setLocation(request.getLocation());
        hospital.setContact(request.getContact());
        hospital.setLatitude(request.getLatitude());
        hospital.setLongitude(request.getLongitude());
        hospital.setEmail(request.getEmail());

        Hospital savedHospital = hospitalRepo.save(hospital);

        HospitalAdmin admin = new HospitalAdmin();
        admin.setUsername(request.getUsername());
        admin.setPassword(passwordEncoder.encode(request.getAdminPassword()));
        admin.setEmail(request.getEmail());
        admin.setHospital(savedHospital);

        adminRepo.save(admin);

        return savedHospital;
    }
}
