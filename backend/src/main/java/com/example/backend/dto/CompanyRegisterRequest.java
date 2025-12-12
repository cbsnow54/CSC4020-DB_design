package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CompanyRegisterRequest {
    private String companyName;
    private String address;
    private String url;
}