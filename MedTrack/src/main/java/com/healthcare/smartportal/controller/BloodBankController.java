package com.healthcare.smartportal.controller;

import com.healthcare.smartportal.model.Hospital;
import com.healthcare.smartportal.service.BloodBankService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bloodbanks")
public class BloodBankController {

    private final BloodBankService bloodBankService;

    public BloodBankController(BloodBankService bloodBankService) {
        this.bloodBankService = bloodBankService;
    }

    @GetMapping("/hospitals")
    public List<Hospital> getHospitalsByBloodGroup(
            @RequestParam String group,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon
    ) {
        return bloodBankService.findHospitalsWithBlood(group, lat, lon);
    }
}

