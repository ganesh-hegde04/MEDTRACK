package com.healthcare.smartportal.repository;

import com.healthcare.smartportal.dto.AppointmentSummaryDto;
import com.healthcare.smartportal.model.Appointment;
import com.healthcare.smartportal.model.Doctor;
import com.healthcare.smartportal.model.User;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    @Query("""
        SELECT new com.healthcare.smartportal.dto.AppointmentSummaryDto(
            a.appointmentId,
            u.name,
            u.phone,
            d.name,
            d.department,
            a.appointmentDate,
            a.appointmentTime
        )
        FROM Appointment a
        JOIN a.user u
        JOIN a.doctor d
        WHERE d.department = :department
          AND a.appointmentDate = :date
          AND a.hospital.id = :hospitalId
    """)
    List<AppointmentSummaryDto> findAppointmentsByDepartmentAndDate(
            @Param("department") String department,
            @Param("date") LocalDate date,
            @Param("hospitalId") UUID hospitalId
    );

    @Query("""
        SELECT a FROM Appointment a
        WHERE 
            (a.appointmentDate > :startDate OR 
            (a.appointmentDate = :startDate AND a.appointmentTime >= :startTime))
        AND 
            (a.appointmentDate < :endDate OR 
            (a.appointmentDate = :endDate AND a.appointmentTime <= :endTime))
    """)
    List<Appointment> findByAppointmentDateTimeBetween(
        @Param("startDate") LocalDate startDate,
        @Param("startTime") LocalTime startTime,
        @Param("endDate") LocalDate endDate,
        @Param("endTime") LocalTime endTime
    );

    boolean existsByDoctorAndAppointmentDateAndAppointmentTime(
        Doctor doctor,
        LocalDate appointmentDate,
        LocalTime appointmentTime
    );
    
    Optional<Appointment> findByAppointmentId(String appointmentId);

    @Query("""
        SELECT a FROM Appointment a WHERE 
        (a.appointmentDate = :today AND a.appointmentTime BETWEEN :startToday AND :endToday)
        OR 
        (a.appointmentDate = :tomorrow AND a.appointmentTime BETWEEN :startTomorrow AND :endTomorrow)
    """)
    List<Appointment> findAppointmentsForReminder(
        @Param("today") LocalDate today,
        @Param("startToday") LocalTime startToday,
        @Param("endToday") LocalTime endToday,
        @Param("tomorrow") LocalDate tomorrow,
        @Param("startTomorrow") LocalTime startTomorrow,
        @Param("endTomorrow") LocalTime endTomorrow
    );

    List<Appointment> findByUser(User user);

}
