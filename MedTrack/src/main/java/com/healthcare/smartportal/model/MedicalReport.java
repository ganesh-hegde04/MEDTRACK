package com.healthcare.smartportal.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
public class MedicalReport {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    private String fileName;
    private String fileType;
    private String patientEmail;
    private LocalDateTime uploadedAt;

    @Lob
    private byte[] encryptedData;
}
