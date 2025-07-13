package com.healthcare.smartportal.controller;

import com.healthcare.smartportal.service.EmailService;
import com.healthcare.smartportal.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verify")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;
    private final EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<?> sendCode(@RequestParam String email) {
        String code = verificationService.generateCode();
        verificationService.saveToken(email, code);

        String subject = "Your Verification Code";
        String body = "Your verification code is: " + code + "\nThis code will expire in 3 minutes.";
        emailService.sendAppointmentReminder(email, subject, body);

        return ResponseEntity.ok("Verification code sent to email.");
    }

    @PostMapping("/check")
    public ResponseEntity<?> verifyCode(@RequestParam String email, @RequestParam String code) {
        boolean valid = verificationService.verifyCode(email, code);
        return valid ? ResponseEntity.ok("Verified")
                     : ResponseEntity.badRequest().body("Invalid or expired code");
    }
}
