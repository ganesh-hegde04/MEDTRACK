package com.healthcare.smartportal.service;

import com.healthcare.smartportal.exception.DoctorNotFoundException;
import com.healthcare.smartportal.exception.SlotAlreadyBookedException;
import com.healthcare.smartportal.model.*;
import com.healthcare.smartportal.repository.AppointmentRepository;
import com.healthcare.smartportal.repository.DoctorRepository;
import com.healthcare.smartportal.repository.HospitalRepository;
import com.healthcare.smartportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepo;
    private final DoctorRepository doctorRepo;
    private final UserRepository userRepo;
    private final EmailService emailService;
    private final HospitalRepository hospitalRepo;

    // ✅ Book Appointment: hospital → department → doctor
    public Appointment bookAppointment(
            String phone,
            String hospitalName,
            String department,
            String doctorName,
            LocalDate date,
            LocalTime time) {

        User user = userRepo.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("User not found with phone: " + phone));

        Hospital hospital = hospitalRepo.findByNameIgnoreCase(hospitalName)
                .orElseThrow(() -> new RuntimeException("Hospital not found: " + hospitalName));

        Doctor doctor = doctorRepo.findByNameAndDepartmentAndHospital(doctorName, department, hospital)
                .orElseThrow(() -> new DoctorNotFoundException("Doctor not found: " + doctorName + " in " + department + " at " + hospitalName));

        if (appointmentRepo.existsByDoctorAndAppointmentDateAndAppointmentTime(doctor, date, time)) {
            throw new SlotAlreadyBookedException("Slot already booked.");
        }

        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setDoctor(doctor);
        appointment.setHospital(hospital);
        appointment.setAppointmentDate(date);
        appointment.setAppointmentTime(time);
        appointment.setStatus(AppointmentStatus.CONFIRMED);
        appointment.setReminderSent(false);
        appointment.setAppointmentId(generateCustomAppointmentId(hospital, user, date, time));

        Appointment saved = appointmentRepo.save(appointment);
        sendConfirmationEmail(saved, "Appointment Confirmed");

        return saved;
    }

    // ✅ Reschedule
    public Appointment rescheduleAppointment(String appointmentId, LocalDate newDate, LocalTime newTime) {
        Appointment appointment = appointmentRepo.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appointmentRepo.existsByDoctorAndAppointmentDateAndAppointmentTime(
                appointment.getDoctor(), newDate, newTime)) {
            throw new SlotAlreadyBookedException("New slot is already booked.");
        }

        appointment.setAppointmentDate(newDate);
        appointment.setAppointmentTime(newTime);
        appointment.setStatus(AppointmentStatus.RESCHEDULED);
        appointment.setReminderSent(false);
        appointment.setAppointmentId(generateCustomAppointmentId(
                appointment.getHospital(), appointment.getUser(), newDate, newTime));

        Appointment saved = appointmentRepo.save(appointment);
        sendConfirmationEmail(saved, "Appointment Rescheduled");

        return saved;
    }

    // ✅ Cancel
    public void cancelAppointment(String appointmentId) {
        Appointment appointment = appointmentRepo.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepo.save(appointment);

        if (appointment.getUser().getEmail() != null) {
            String subject = "Appointment Cancelled";
            String body = String.format("Hi %s,\n\nYour appointment on %s at %s has been cancelled.\n\nDoctor: %s\nHospital: %s\n\nThanks,\nSmart Portal Team",
                    appointment.getUser().getName(),
                    appointment.getAppointmentDate(),
                    appointment.getAppointmentTime(),
                    appointment.getDoctor().getName(),
                    appointment.getHospital().getName());
            emailService.sendAppointmentReminder(appointment.getUser().getEmail(), subject, body);
        }
    }

    // ✅ Cancel by Hospital
    public void cancelByHospitalWithNotification(String appointmentId, String reason) {
        Appointment appointment = appointmentRepo.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new RuntimeException("Appointment is already cancelled");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepo.save(appointment);

        String patientEmail = appointment.getUser().getEmail();
        String doctorName = appointment.getDoctor().getName();
        String hospitalName = appointment.getHospital().getName();
        String appointmentDateTime = appointment.getAppointmentDate() + " " + appointment.getAppointmentTime();

        if (patientEmail != null && !patientEmail.isBlank()) {
            emailService.sendAppointmentCancellation(patientEmail, doctorName, hospitalName, appointmentDateTime, reason);
        }
    }

    // ✅ Custom Appointment ID Generator
    private String generateCustomAppointmentId(Hospital hospital, User user, LocalDate date, LocalTime time) {
        String hospitalName = hospital != null ? hospital.getName().replaceAll("\\s+", "") : "Hospital";

        String username = "User";
        if (user != null) {
            if (user.getUsername() != null && !user.getUsername().isBlank()) {
                username = user.getUsername().replaceAll("\\s+", "");
            } else if (user.getEmail() != null && !user.getEmail().isBlank()) {
                username = user.getEmail().split("@")[0].replaceAll("\\s+", "");
            }
        }

        String dateStr = date.format(DateTimeFormatter.ISO_LOCAL_DATE);
        String timeStr = time.format(DateTimeFormatter.ofPattern("HHmm"));

        return hospitalName + "_" + username + "_" + dateStr + "_" + timeStr;
    }

    // ✅ Confirmation Email
    private void sendConfirmationEmail(Appointment appointment, String subject) {
        User user = appointment.getUser();
        String email = user.getEmail();
        if (email != null && !email.isBlank()) {
            String body = String.format(
                    "Hi %s,\n\nYour appointment has been %s.\n\nDate: %s\nTime: %s\nDoctor: %s\nHospital: %s\nAppointment ID: %s\n\nThanks,\nSmart Portal Team",
                    user.getName(),
                    appointment.getStatus().name().toLowerCase(),
                    appointment.getAppointmentDate(),
                    appointment.getAppointmentTime(),
                    appointment.getDoctor().getName(),
                    appointment.getHospital().getName(),
                    appointment.getAppointmentId()
            );
            emailService.sendAppointmentReminder(email, subject, body);
        }
    }
}
