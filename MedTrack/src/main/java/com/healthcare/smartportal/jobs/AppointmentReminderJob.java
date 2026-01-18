package com.healthcare.smartportal.jobs;

import com.healthcare.smartportal.model.Appointment;
import com.healthcare.smartportal.model.User;
import com.healthcare.smartportal.repository.AppointmentRepository;
import com.healthcare.smartportal.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
@Slf4j
@Component
@RequiredArgsConstructor
public class AppointmentReminderJob {

    private final AppointmentRepository appointmentRepository;
    private final EmailService emailService;

    // Runs every 1 minute
    @Scheduled(fixedRate = 60000)
    public void sendReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime windowStart = now.plusHours(3).minusMinutes(10);
        LocalDateTime windowEnd = now.plusHours(3).plusMinutes(10);

        LocalDate today = windowStart.toLocalDate();
        LocalDate tomorrow = windowEnd.toLocalDate();

        LocalTime startToday = windowStart.toLocalTime();
        LocalTime endToday = (today.equals(tomorrow)) ? windowEnd.toLocalTime() : LocalTime.MAX;
        LocalTime startTomorrow = (today.equals(tomorrow)) ? LocalTime.MIN : LocalTime.MIN;
        LocalTime endTomorrow = windowEnd.toLocalTime();

        List<Appointment> upcomingAppointments = appointmentRepository.findAppointmentsForReminder(
                today, startToday, endToday,
                tomorrow, startTomorrow, endTomorrow
        );

        log.debug("[ReminderJob] Found %d appointments on %s between %s and %s%n",
                upcomingAppointments.size(), today, startToday, endToday);
        if (!today.equals(tomorrow)) {
            log.debug("[ReminderJob] Also checking %s between %s and %s%n",
                    tomorrow, startTomorrow, endTomorrow);
        }

        for (Appointment appt : upcomingAppointments) {
            User user = appt.getUser();
            String email = user.getEmail();

            if (email != null && !email.isEmpty() && !appt.isReminderSent()) {
                String subject = "Appointment Reminder";
                String body = String.format(
                        "Hi %s,\n\nThis is a reminder that you have an appointment scheduled at %s on %s.\n" +
                        "Appointment ID: %s\nDoctor: %s\nHospital: %s\n\nThanks,\nSmart Portal Team",
                        user.getName(),
                        appt.getAppointmentTime(),
                        appt.getAppointmentDate(),
                        appt.getAppointmentId(),
                        appt.getDoctor() != null ? appt.getDoctor().getName() : "N/A",
                        appt.getHospital() != null ? appt.getHospital().getName() : "N/A"
                );

                emailService.sendAppointmentReminder(email, subject, body);

                appt.setReminderSent(true); // Prevent duplicate emails
                appointmentRepository.save(appt);

                log.debug("[ReminderJob] Sent reminder to %s for appointment at %s on %s%n",
                        email, appt.getAppointmentTime(), appt.getAppointmentDate());
            }
        }
    }
}
