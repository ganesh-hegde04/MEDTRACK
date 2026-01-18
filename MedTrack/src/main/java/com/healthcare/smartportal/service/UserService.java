package com.healthcare.smartportal.service;

import com.healthcare.smartportal.model.User;
import com.healthcare.smartportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User registerUser(User userRequest) {
        if (userRepository.existsByPhone(userRequest.getPhone())) {
            throw new RuntimeException("User already exists with phone: " + userRequest.getPhone());
        }
      
        return userRepository.save(userRequest);
    }
}
