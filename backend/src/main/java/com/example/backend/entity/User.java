package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "USER")
@Getter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id
    @Column(name = "phone_number", length = 16)
    private String phoneNumber;

    @Column(nullable = false, length = 16)
    private String password;

    @Column(name = "user_name", nullable = false, length = 10)
    private String userName;
}