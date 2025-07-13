package com.healthcare.smartportal.jobs;

import com.healthcare.smartportal.model.Appointment;
import com.healthcare.smartportal.model.User;
import com.healthcare.smartportal.repository.AppointmentRepository;
import com.healthcare.smartportal.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AppointmentReminderJob {

    private final AppointmentRepository appointmentRepository;
    private final EmailService emailService;

    // Runs every 2 minutes
    @Scheduled(fixedRate = 120000)
    public void sendReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = now.toLocalDate();
        LocalTime startTime = now.toLocalTime();
        LocalTime endTime = startTime.plusHours(1);

        List<Appointment> upcomingAppointments = appointmentRepository
                .findAppointmentsOnDateBetweenTimes(today, startTime, endTime);

        System.out.printf("[ReminderJob] Found %d upcoming appointments between %s and %s on %s%n",
                upcomingAppointments.size(), startTime, endTime, today);

        for (Appointment appt : upcomingAppointments) {
            User user = appt.getUser();
            String email = user.getEmail();

            if (email != null && !email.isEmpty()) {
                String subject = "Appointment Reminder";
                String body = String.format("Hi %s,\n\nThis is a reminder that you have an appointment scheduled at %s on %s.\n\nThanks,\nSmart Portal Team",
                        user.getName(),
                        appt.getAppointmentTime(),
                        appt.getAppointmentDate());

                emailService.sendAppointmentReminder(email, subject, body);

                System.out.printf("[ReminderJob] Sent reminder to %s for appointment at %s on %s%n",
                        email, appt.getAppointmentTime(), appt.getAppointmentDate());
            }
        }
    }
}
