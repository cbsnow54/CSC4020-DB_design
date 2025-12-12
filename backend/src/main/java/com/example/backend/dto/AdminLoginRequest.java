package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AdminLoginRequest {
    private String id;
    private String password;
}