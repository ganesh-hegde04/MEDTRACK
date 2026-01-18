package com.healthcare.smartportal.controller;

import com.healthcare.smartportal.model.MedicalReport;
import com.healthcare.smartportal.repository.MedicalReportRepository;
import com.healthcare.smartportal.service.EncryptionService;
import com.healthcare.smartportal.service.TokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class MedicalReportController {

    private final EncryptionService encryptionService;
    private final MedicalReportRepository reportRepository;
    private final TokenService tokenService;

    // ✅ Extract email from JWT token
    private String extractEmailFromAuthHeader(String authHeader) throws Exception {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new Exception("Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7);
        return tokenService.extractEmailFromToken(token); // assumes your TokenService handles email
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadReport(@RequestHeader("Authorization") String authHeader,
                                          @RequestParam("file") MultipartFile file) {
        try {
            String email = extractEmailFromAuthHeader(authHeader);

            byte[] encrypted = encryptionService.encrypt(file.getBytes());

            MedicalReport report = new MedicalReport();
            report.setFileName(file.getOriginalFilename());
            report.setFileType(file.getContentType());
            report.setPatientEmail(email);
            report.setEncryptedData(encrypted);
            report.setUploadedAt(LocalDateTime.now());

            reportRepository.save(report);

            return ResponseEntity.ok("Report uploaded securely.");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Upload failed: " + ex.getMessage());
        }
    }

    @GetMapping("/download")
    public ResponseEntity<?> downloadReport(@RequestHeader("Authorization") String authHeader,
                                            @RequestParam("fileName") String fileName) {
        try {
            String email = extractEmailFromAuthHeader(authHeader);

            Optional<MedicalReport> reportOpt = reportRepository
                    .findByPatientEmailAndFileName(email, fileName);

            if (reportOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Report not found.");
            }

            MedicalReport report = reportOpt.get();
            byte[] decrypted = encryptionService.decrypt(report.getEncryptedData());

            return ResponseEntity.ok()
                    .header("Content-Disposition", "inline; filename=\"" + report.getFileName() + "\"")
                    .header("Content-Type", report.getFileType())
                    .body(decrypted);

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Download failed: " + ex.getMessage());
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> listReports(@RequestHeader("Authorization") String authHeader) {
        try {
            String email = extractEmailFromAuthHeader(authHeader);

            log.debug("Fetching reports for email: " + email);

            List<MedicalReport> reports = reportRepository.findReports(email);

            log.debug("Reports found: " + reports.size());

            List<Map<String, Object>> response = reports.stream().map(report -> {
                Map<String, Object> map = new HashMap<>();
                map.put("fileName", report.getFileName());
                map.put("fileType", report.getFileType());
                map.put("uploadedAt", report.getUploadedAt());
                return map;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Failed to list reports: " + ex.getMessage());
        }
    }
}
