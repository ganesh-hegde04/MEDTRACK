package com.healthcare.smartportal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.io.PrintStream;

@SpringBootApplication
@EnableScheduling
public class SmartportalApplication {

    public static void main(String[] args) {

        System.setOut(new PrintStream(System.out) {
            @Override
            public void println(String x) {
                
            }
        });

        SpringApplication.run(SmartportalApplication.class, args);
    }
}
