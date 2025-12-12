package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter @Setter
public class AdConsentRequest {
    private String adminId;
    private String phoneNumber;
    private Integer consentStatus;
    private LocalDateTime selectedDate; 
}