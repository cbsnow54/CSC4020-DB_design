package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ADMIN")
@Getter @NoArgsConstructor @AllArgsConstructor @Builder
public class Admin {
    @Id
    @Column(length = 16)
    private String id;

    @Column(nullable = false, length = 16)
    private String password;

    @ManyToOne(fetch = FetchType.EAGER) 
    @JoinColumn(name = "company_name", nullable = false)
    private Company company;
}