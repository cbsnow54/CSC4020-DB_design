package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserSignupRequest {
    private String phoneNumber;
    private String password;
    private String userName;
    private String verificationCode;
}