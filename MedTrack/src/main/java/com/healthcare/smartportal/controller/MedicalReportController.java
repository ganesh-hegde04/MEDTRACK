package com.healthcare.smartportal.controller;

import com.healthcare.smartportal.model.MedicalReport;
import com.healthcare.smartportal.repository.MedicalReportRepository;
import com.healthcare.smartportal.service.EncryptionService;
import lombok.RequiredArgsConstructor;

import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class MedicalReportController {

    private final EncryptionService encryptionService;
    private final MedicalReportRepository reportRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadReport(@RequestParam("file") MultipartFile file,
                                          @RequestParam("email") String email) {
        try {
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
            return ResponseEntity.status(500).body("Upload failed: " + ex.getMessage());
        }
    }
    @GetMapping("/download")
public ResponseEntity<?> downloadReport(@RequestParam("email") String email,
                                        @RequestParam("fileName") String fileName) {
    try {
        Optional<MedicalReport> reportOpt = reportRepository
            .findByPatientEmailAndFileName(email, fileName);

        if (reportOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Report not found.");
        }

        MedicalReport report = reportOpt.get();
        byte[] decrypted = encryptionService.decrypt(report.getEncryptedData());

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + report.getFileName() + "\"")
                .header("Content-Type", report.getFileType())
                .body(decrypted);

    } catch (Exception ex) {
        return ResponseEntity.status(500).body("Failed to download: " + ex.getMessage());
    }
}

}
