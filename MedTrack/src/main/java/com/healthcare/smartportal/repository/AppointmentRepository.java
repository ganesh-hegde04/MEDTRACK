package com.healthcare.smartportal.repository;

import com.healthcare.smartportal.model.Appointment;
import com.healthcare.smartportal.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    boolean existsByDoctorAndAppointmentDateAndAppointmentTime(
        Doctor doctor,
        LocalDate appointmentDate,
        LocalTime appointmentTime
    );

    @Query("""
        SELECT a FROM Appointment a 
        WHERE a.appointmentDate = :date 
          AND a.appointmentTime BETWEEN :startTime AND :endTime
    """)
    List<Appointment> findAppointmentsOnDateBetweenTimes(
        @Param("date") LocalDate date,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime
    );
}
