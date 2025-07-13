package com.healthcare.smartportal.service;

import com.healthcare.smartportal.model.User;
import com.healthcare.smartportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(User userRequest) {
        if (userRepository.existsByPhone(userRequest.getPhone())) {
            throw new RuntimeException("User already exists with phone: " + userRequest.getPhone());
        }
        // Hash the password before saving
        String encodedPassword = passwordEncoder.encode(userRequest.getPassword());
        userRequest.setPassword(encodedPassword);

        return userRepository.save(userRequest);
    }
}
