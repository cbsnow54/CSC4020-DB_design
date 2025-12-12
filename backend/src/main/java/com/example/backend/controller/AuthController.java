package com.example.backend.controller;

import com.example.backend.dto.*;
import com.example.backend.entity.Admin;
import com.example.backend.entity.Company;
import com.example.backend.entity.User;
import com.example.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/auth/verify-code")
    public ResponseEntity<String> sendVerificationCode(@RequestBody Map<String, String> payload) {
        return ResponseEntity.ok("인증번호가 발송되었습니다.");
    }

    @PostMapping("/auth/signup/user")
    public ResponseEntity<String> registerUser(@RequestBody UserSignupRequest request) {
        try {
            authService.registerUser(request);
            return ResponseEntity.ok("사용자 가입 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/companies/search")
    public ResponseEntity<List<Company>> searchCompanies(@RequestParam String keyword) {
        return ResponseEntity.ok(authService.searchCompanies(keyword));
    }

    @GetMapping("/auth/admin/check-id")
    public ResponseEntity<Boolean> checkAdminId(@RequestParam String id) {
        boolean isDuplicated = authService.checkAdminIdDuplication(id);
        return ResponseEntity.ok(isDuplicated);
    }

    @PostMapping("/auth/signup/admin")
    public ResponseEntity<String> registerAdmin(@RequestBody AdminSignupRequest request) {
        try {
            authService.registerAdmin(request);
            return ResponseEntity.ok("관리자 가입 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/auth/login/user")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginRequest request) {
        try {
            User user = authService.loginUser(request);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/auth/login/admin")
    public ResponseEntity<?> loginAdmin(@RequestBody AdminLoginRequest request) {
        try {
            Admin admin = authService.loginAdmin(request);
            return ResponseEntity.ok(admin);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}