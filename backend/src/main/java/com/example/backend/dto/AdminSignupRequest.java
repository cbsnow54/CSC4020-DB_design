package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AdminSignupRequest {
    private String id;
    private String password;
    private String companyName;
}