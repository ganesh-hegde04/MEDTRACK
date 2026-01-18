package com.healthcare.smartportal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.healthcare.smartportal.model.Animal;
import com.healthcare.smartportal.model.Hospital;
import com.healthcare.smartportal.service.AntivenomService;

@RestController
@RequestMapping("/api/antivenom")
public class AntivenomController {

    @Autowired
    private AntivenomService antivenomService;

    // Endpoint to get all venomous animals
    @GetMapping("/animals")
    public List<Animal> getAllVenomousAnimals() {
        return antivenomService.getVenomousAnimals();
    }

    // Endpoint to get hospitals with antivenom based on animal name and location (latitude and longitude)
    @GetMapping("/hospitals")
    public List<Hospital> getHospitalsWithAntivenom(
            @RequestParam String animal,  
            @RequestParam(required = false) Double lat,  
            @RequestParam(required = false) Double lon   
    ) {
        return antivenomService.getHospitalsWithAntivenom(animal, lat, lon);
    }
}
