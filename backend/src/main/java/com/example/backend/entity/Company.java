package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "COMPANY")
@Getter @NoArgsConstructor @AllArgsConstructor @Builder
public class Company {
    @Id
    @Column(name = "company_name", length = 50)
    private String companyName;

    @Column(nullable = false, length = 200)
    private String address;

    @Column(length = 200)
    private String url;
}