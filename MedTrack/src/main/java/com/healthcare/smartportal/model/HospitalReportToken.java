package com.healthcare.smartportal.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HospitalReportToken {
    @Id
    private String phone; 
    private String code;
    private LocalDateTime createdAt;
}
