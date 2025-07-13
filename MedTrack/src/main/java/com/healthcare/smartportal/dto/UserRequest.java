package com.healthcare.smartportal.dto;

import lombok.Data;

@Data
public class UserRequest {
    private String name;
    private String email;
    private String phone;
    private String bloodGroup;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String username;
    private String password;
}
