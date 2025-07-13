package com.healthcare.smartportal.service;

import com.healthcare.smartportal.exception.DoctorNotFoundException;
import com.healthcare.smartportal.exception.SlotAlreadyBookedException;
import com.healthcare.smartportal.model.Appointment;
import com.healthcare.smartportal.model.Doctor;
import com.healthcare.smartportal.model.Hospital;
import com.healthcare.smartportal.model.User;
import com.healthcare.smartportal.repository.AppointmentRepository;
import com.healthcare.smartportal.repository.DoctorRepository;
import com.healthcare.smartportal.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepo;
    private final DoctorRepository doctorRepo;
    private final UserRepository userRepo;

    public Appointment bookAppointment(String phone, UUID doctorId, LocalDate date, LocalTime time) {
        // Fetch user by phone number
        User user = userRepo.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("User not found with phone: " + phone));

        // Fetch doctor by ID
        Doctor doctor = doctorRepo.findById(doctorId)
                .orElseThrow(() -> new DoctorNotFoundException("Doctor not found with ID: " + doctorId));

        Hospital hospital = doctor.getHospital();

        // Check if slot is already booked
        if (appointmentRepo.existsByDoctorAndAppointmentDateAndAppointmentTime(doctor, date, time)) {
            throw new SlotAlreadyBookedException("Slot already booked.");
        }

        // Book appointment
        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setDoctor(doctor);
        appointment.setHospital(hospital);
        appointment.setAppointmentDate(date);
        appointment.setAppointmentTime(time);
        appointment.setStatus("CONFIRMED");
        appointment.setAppointmentId(generateAppointmentId(hospital));

        return appointmentRepo.save(appointment);
    }

    private String generateAppointmentId(Hospital hospital) {
        return "APT-" + hospital.getId() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}
