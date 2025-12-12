package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "AD_CONSENT")
@Getter @NoArgsConstructor @AllArgsConstructor @Builder
public class AdConsent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consent_id")
    private Long consentId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_name", nullable = false)
    private Company company;

    @Column(name = "phone_number", nullable = false, length = 16)
    private String phoneNumber;

    @Column(name = "consent_status", nullable = false)
    private Integer consentStatus;

    @Column(name = "status_date", nullable = false)
    private LocalDateTime statusDate;

    @OneToOne(mappedBy = "adConsent", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private ConsentHistory consentHistory;

    public void withdraw() {
        this.consentHistory = ConsentHistory.builder()
                .adConsent(this)
                .pastConsentDate(this.statusDate)
                .build();
        this.consentStatus = 0;
        this.statusDate = LocalDateTime.now();
    }

    
    public void reConsent(LocalDateTime newDate) {
        this.consentStatus = 1;
        this.statusDate = newDate;
        this.consentHistory = null;
    }
}