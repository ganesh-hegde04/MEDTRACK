package com.healthcare.smartportal.model;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import java.util.UUID;

@Entity
public class HospitalAdmin {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
        name = "UUID",
        strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "BINARY(16)")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "hospital_id", nullable = false, columnDefinition = "BINARY(16)")
    private Hospital hospital;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    public HospitalAdmin() {}

    public HospitalAdmin(Hospital hospital, String username, String password) {
        this.hospital = hospital;
        this.username = username;
        this.password = password;
    }

    public UUID getId() { return id; }

    public void setId(UUID id) { this.id = id; }

    public Hospital getHospital() { return hospital; }

    public void setHospital(Hospital hospital) { this.hospital = hospital; }

    public String getUsername() { return username; }

    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    @Override
    public String toString() {
        return "HospitalAdmin{" +
                "id=" + id +
                ", hospital=" + (hospital != null ? hospital.getId() : null) +
                ", username='" + username + '\'' +
                '}';
    }
}
