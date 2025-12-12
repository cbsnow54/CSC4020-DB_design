package com.example.backend.controller;

import com.example.backend.dto.CompanyRegisterRequest;
import com.example.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CompanyController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> registerCompany(@RequestBody CompanyRegisterRequest request) {
        try {
            authService.registerCompany(request);
            return ResponseEntity.ok("기업 등록 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}