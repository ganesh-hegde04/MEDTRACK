package com.healthcare.smartportal.controller;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class KeepAliveController {

    @GetMapping("/api/keep-alive")
    public ResponseEntity<Map<String, Object>> keepAlive() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Backend is awake");
        response.put("timestamp", Instant.now().toString());

        return ResponseEntity.ok(response);
    }
}
