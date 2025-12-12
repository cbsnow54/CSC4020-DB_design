package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "CONSENT_HISTORY")
@Getter @NoArgsConstructor @AllArgsConstructor @Builder
public class ConsentHistory {
    @Id
    @Column(name = "consent_id")
    private Long consentId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consent_id")
    @JsonIgnore
    private AdConsent adConsent;

    @Column(name = "past_consent_date", nullable = false)
    private LocalDateTime pastConsentDate;
}