package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserLoginRequest {
    private String phoneNumber;
    private String password;
}