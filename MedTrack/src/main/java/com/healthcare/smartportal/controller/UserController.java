package com.healthcare.smartportal.controller;

import com.healthcare.smartportal.dto.UserRequest;
import com.healthcare.smartportal.model.User;
import com.healthcare.smartportal.service.UserService;
import com.healthcare.smartportal.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final VerificationService verificationService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRequest request) {
        // Check if the email has been verified
        if (!verificationService.isEmailVerified(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email not verified.");
        }

        try {
            // Map UserRequest to User entity
            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPhone(request.getPhone());
            user.setBloodGroup(request.getBloodGroup());
            user.setEmergencyContactName(request.getEmergencyContactName());
            user.setEmergencyContactPhone(request.getEmergencyContactPhone());
            user.setUsername(request.getUsername());
            user.setPassword(request.getPassword());  

            User savedUser = userService.registerUser(user);

            // Clear verification status after successful registration
            verificationService.clearVerificationStatus(request.getEmail());

            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
