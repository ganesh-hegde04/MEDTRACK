package com.healthcare.smartportal.controller;

import com.healthcare.smartportal.dto.HospitalRegistrationRequest;
import com.healthcare.smartportal.dto.AdminLoginRequest;
import com.healthcare.smartportal.model.Hospital;
import com.healthcare.smartportal.service.HospitalAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class HospitalAdminController {

    @Autowired
    private HospitalAdminService adminService;

    // ================= UNCHANGED =================
    @PostMapping("/register")
    public ResponseEntity<?> registerHospitalWithAdmin(
            @RequestBody HospitalRegistrationRequest request) {
        try {
            Hospital hospital = adminService.registerHospitalAndAdmin(request);
            UUID hospitalId = hospital.getId();
            return ResponseEntity.ok(
                "Hospital and admin registered with hospital ID: " + hospitalId
                + "\nPlease NOTE: THIS ID needs to be entered while updating blood or antivenom stock."
                + "\nTherefore, please note this ID and keep it safe."
            );
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body("Validation failed: " + ex.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Something went wrong: " + e.getMessage());
        }
    }

    // ================= 🔒 UPDATED LOGIN ONLY =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequest request) {
        try {
            String token = adminService.loginAndGenerateToken(
                request.getUsername(),
                request.getPassword()
            );

            return ResponseEntity.ok(
                Map.of(
                    "token", token,
                    "role", "ADMIN"
                )
            );

        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Invalid credentials");
        }
    }

    // ================= UNCHANGED =================
    @PostMapping("/antivenom/update")
    public ResponseEntity<String> updateAntivenomInventory(
            @RequestParam UUID hospitalId,
            @RequestParam String animalName,
            @RequestParam int quantity) {

        boolean success = adminService.updateAntivenom(
            hospitalId, animalName, quantity
        );

        if (success) {
            return ResponseEntity.ok("Antivenom inventory updated.");
        } else {
            return ResponseEntity.badRequest()
                .body("Failed to update inventory. Please check animal name or hospital ID.");
        }
    }

    // ================= UNCHANGED =================
    @PostMapping("/blood/update")
    public ResponseEntity<String> updateBloodInventory(
            @RequestParam UUID hospitalId,
            @RequestParam String bloodGroup,
            @RequestParam int quantity) {

        boolean success = adminService.updateBlood(
            hospitalId, bloodGroup, quantity
        );

        if (success) {
            return ResponseEntity.ok("Blood inventory updated.");
        } else {
            return ResponseEntity.badRequest()
                .body("Failed to update blood inventory. Please check hospital ID or blood group.");
        }
    }
}
