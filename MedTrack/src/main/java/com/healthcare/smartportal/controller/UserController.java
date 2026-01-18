package com.healthcare.smartportal.controller;

import com.healthcare.smartportal.dto.AppointmentResponse;
import com.healthcare.smartportal.dto.LoginRequest;
import com.healthcare.smartportal.dto.UserRequest;
import com.healthcare.smartportal.model.Appointment;
import com.healthcare.smartportal.model.User;
import com.healthcare.smartportal.repository.AppointmentRepository;
import com.healthcare.smartportal.repository.UserRepository;
import com.healthcare.smartportal.service.TokenService;
import com.healthcare.smartportal.service.UserService;
import com.healthcare.smartportal.service.VerificationService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final VerificationService verificationService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final AppointmentRepository appointmentRepository;

    // ✅ User Registration Endpoint
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRequest request) {
        if (!verificationService.isEmailVerified(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email not verified.");
        }

        try {
            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPhone(request.getPhone());
            user.setBloodGroup(request.getBloodGroup());
            user.setEmergencyContactName(request.getEmergencyContactName());
            user.setEmergencyContactPhone(request.getEmergencyContactPhone());
            user.setUsername(request.getUsername());
            user.setPassword(passwordEncoder.encode(request.getPassword())); // ✅ Secure password

            User savedUser = userService.registerUser(user);
            verificationService.clearVerificationStatus(request.getEmail());

            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
    
    
    System.out.println("🔍 DEBUG: Trying login for username='" + loginRequest.getUsername() + "'");
    
    Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());

    if (userOpt.isPresent()) {
        User user = userOpt.get();
        
        
        System.out.println(" User found: " + user.getUsername());
        System.out.println(" Stored password hash: " + user.getPassword());
        System.out.println("Hash starts with $2a$? " + (user.getPassword() != null && user.getPassword().startsWith("$2a$")));
        
        // DIRECT BCrypt DEBUGGING
        try {
            boolean passwordMatches = BCrypt.checkpw(loginRequest.getPassword(), user.getPassword());
            System.out.println(" BCrypt.checkpw result: " + passwordMatches);
            
            if (passwordMatches) {
                String token = tokenService.generateToken(user.getPhone(), user.getEmail());
                
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("phone", user.getPhone());
                response.put("email", user.getEmail());

                System.out.println("✅ Login SUCCESS for: " + user.getUsername());
                return ResponseEntity.ok(response);
            } else {
                System.out.println("❌ Password mismatch for user: " + user.getUsername());
                System.out.println("   Input password: " + loginRequest.getPassword());
            }
        } catch (Exception e) {
            System.out.println("❌ BCrypt ERROR: " + e.getMessage());
            System.out.println("   This means password is NOT BCrypt encoded!");
        }
    } else {
        System.out.println("❌ User NOT FOUND with username: " + loginRequest.getUsername());
    }

    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
}
    // ✅ Get User Appointments Endpoint
   @GetMapping("/{phone}/appointments")
public ResponseEntity<?> getUserAppointments(
        @PathVariable String phone,
        @RequestHeader("Authorization") String authHeader
) {
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header");
    }

    String token = authHeader.substring(7);

    String phoneFromToken;
    try {
        phoneFromToken = tokenService.extractPhoneFromToken(token);

        System.out.println("Phone in URL: " + phone);
        System.out.println("Phone in Token: " + phoneFromToken);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
    }

    if (!phone.equals(phoneFromToken)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token and phone mismatch");
    }

    Optional<User> userOpt = userRepository.findByPhone(phone);
    if (userOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    User user = userOpt.get();
    List<Appointment> allAppointments = appointmentRepository.findByUser(user);

    List<AppointmentResponse> upcomingAppointments = allAppointments.stream()
           .filter(app -> {
    String status = app.getStatus().toString();
    boolean isCancelled = "CANCELLED".equals(status);
    boolean isUpcoming = app.getAppointmentDateTime().isAfter(LocalDateTime.now());
    return !isCancelled && isUpcoming;
})
            .map(app -> new AppointmentResponse(
                    app.getAppointmentId(),
                    app.getAppointmentDate(),
                    app.getAppointmentTime(),
                    app.getStatus(),
                    app.getDoctor().getName(),
                    app.getHospital().getName()
            ))
            .toList();

    Map<String, Object> response = new HashMap<>();
    response.put("appointments", upcomingAppointments);
    response.put("notifications", List.of());

    return ResponseEntity.ok(response);
}

}