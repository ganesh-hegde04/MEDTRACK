package com.healthcare.smartportal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SmartportalApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmartportalApplication.class, args);
	}

}
