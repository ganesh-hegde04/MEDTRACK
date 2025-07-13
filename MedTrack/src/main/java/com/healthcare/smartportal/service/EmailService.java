package com.healthcare.smartportal.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendAppointmentReminder(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("medtrack505@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }
    public void sendAppointmentCancellation(String to, String doctorName, String hospitalName, String appointmentDateTime, String reason) {
    String subject = "Appointment Cancelled: Dr. " + doctorName + " (" + hospitalName + ")";
    String body = "Dear Patient,\n\nWe regret to inform you that your appointment with Dr. "
            + doctorName + " at " + hospitalName + " scheduled on " + appointmentDateTime + " has been cancelled.\n\n"
            + "Reason: " + reason
            + "\n\nWe apologize for the inconvenience caused.\n\nSincerely,\nSmart Portal Team";
    
    sendAppointmentReminder(to, subject, body);
}

    
}
