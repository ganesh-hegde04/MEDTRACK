package com.healthcare.smartportal.dto;

import java.util.List;
import java.util.UUID;

public record HospitalSearchDTO(
    UUID id,
    String name,
    String location,
    List<String> departments
) {}
