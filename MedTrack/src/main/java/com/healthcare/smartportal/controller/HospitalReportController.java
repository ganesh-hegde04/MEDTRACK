package com.healthcare.smartportal.controller;

import com.healthcare.smartportal.model.HospitalReportToken;
import com.healthcare.smartportal.model.MedicalReport;
import com.healthcare.smartportal.model.User;
import com.healthcare.smartportal.repository.HospitalReportTokenRepository;
import com.healthcare.smartportal.repository.MedicalReportRepository;
import com.healthcare.smartportal.repository.UserRepository;
import com.healthcare.smartportal.service.EncryptionService;
import com.healthcare.smartportal.service.EmailService;
import com.healthcare.smartportal.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/hospital")
@RequiredArgsConstructor
public class HospitalReportController {

    private final UserRepository userRepository;
    private final HospitalReportTokenRepository hospitalTokenRepo;
    private final MedicalReportRepository reportRepository;
    private final VerificationService verificationService;
    private final EmailService emailService;
    private final EncryptionService encryptionService;

    // 1. Send code to patient's email for hospital upload
    @PostMapping("/send-code")
    public ResponseEntity<?> sendHospitalUploadCode(@RequestParam String phone) {
        Optional<User> patient = userRepository.findByPhone(phone);
        if (patient.isEmpty()) return ResponseEntity.badRequest().body("Invalid phone number.");

        String code = verificationService.generateCode();

        hospitalTokenRepo.deleteById(phone);
        hospitalTokenRepo.save(new HospitalReportToken(phone, code, LocalDateTime.now()));

        emailService.sendAppointmentReminder(
            patient.get().getEmail(),
            "Hospital Report Upload Code",
            "Your verification code: " + code
        );
        return ResponseEntity.ok("Code sent to patient's email.");
    }

    // 2. Verify code before upload
    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyHospitalCode(@RequestParam String phone,
                                                @RequestParam String code) {
        Optional<HospitalReportToken> token = hospitalTokenRepo.findById(phone);
        if (token.isPresent()
                && token.get().getCode().equals(code)
                && token.get().getCreatedAt().isAfter(LocalDateTime.now().minusMinutes(5))) {
            return ResponseEntity.ok("Verified");
        }
        return ResponseEntity.badRequest().body("Invalid or expired code");
    }

    // 3. Upload report after verification
    @PostMapping("/upload")
    public ResponseEntity<?> uploadByHospital(@RequestParam("file") MultipartFile file,
                                              @RequestParam String phone,
                                              @RequestParam String code) {
        try {
            Optional<HospitalReportToken> token = hospitalTokenRepo.findById(phone);
            if (token.isEmpty()
                    || !token.get().getCode().equals(code)
                    || token.get().getCreatedAt().isBefore(LocalDateTime.now().minusMinutes(5))) {
                return ResponseEntity.badRequest().body("Invalid or expired code");
            }

            Optional<User> patient = userRepository.findByPhone(phone);
            if (patient.isEmpty()) return ResponseEntity.badRequest().body("Invalid patient.");

            byte[] encrypted = encryptionService.encrypt(file.getBytes());

            MedicalReport report = new MedicalReport();
            report.setFileName(file.getOriginalFilename());
            report.setFileType(file.getContentType());
            report.setPatientEmail(patient.get().getEmail());
            report.setEncryptedData(encrypted);
            report.setUploadedAt(LocalDateTime.now());

            reportRepository.save(report);

            hospitalTokenRepo.deleteById(phone);

            return ResponseEntity.ok("Report uploaded securely.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }
}
