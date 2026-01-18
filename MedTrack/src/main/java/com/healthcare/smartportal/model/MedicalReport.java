package com.healthcare.smartportal.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.PrePersist;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
public class MedicalReport {

    @Id
    @Column(columnDefinition = "BINARY(16)", nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String fileType;

    @Column(nullable = false)
    private String patientEmail;

    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    @Lob
    @Column(columnDefinition = "LONGBLOB", nullable = false)
    private byte[] encryptedData;

    public MedicalReport() {
    }

    @PrePersist
    private void onCreate() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
        if (this.uploadedAt == null) {
            this.uploadedAt = LocalDateTime.now();
        }
    }
}
