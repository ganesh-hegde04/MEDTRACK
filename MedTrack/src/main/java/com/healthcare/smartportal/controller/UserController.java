package com.healthcare.smartportal.controller;

import com.healthcare.smartportal.dto.UserRequest;
import com.healthcare.smartportal.model.User;
import com.healthcare.smartportal.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRequest request) {
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
            user.setPassword(request.getPassword());  // Plain password, will be hashed in service
            
            User savedUser = userService.registerUser(user);
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
