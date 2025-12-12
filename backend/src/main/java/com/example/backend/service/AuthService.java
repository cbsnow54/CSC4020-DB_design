package com.example.backend.service;

import com.example.backend.dto.*;
import com.example.backend.entity.Admin;
import com.example.backend.entity.Company;
import com.example.backend.entity.User;
import com.example.backend.repository.AdminRepository;
import com.example.backend.repository.CompanyRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final CompanyRepository companyRepository;

    @Transactional
    public void registerUser(UserSignupRequest dto) {
        if (userRepository.existsById(dto.getPhoneNumber())) {
            throw new RuntimeException("이미 가입된 전화번호입니다.");
        }
        
        if (dto.getVerificationCode() == null || dto.getVerificationCode().length() != 6) {
            throw new RuntimeException("인증번호를 확인해주세요.");
        }

        User user = User.builder()
                .phoneNumber(dto.getPhoneNumber())
                .password(dto.getPassword())
                .userName(dto.getUserName())
                .build();
        
        userRepository.save(user);
    }

    @Transactional
    public void registerAdmin(AdminSignupRequest dto) {
        if (adminRepository.existsById(dto.getId())) {
            throw new RuntimeException("이미 사용 중인 ID입니다.");
        }

        Company company = companyRepository.findById(dto.getCompanyName())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 기업입니다."));

        Admin admin = Admin.builder()
                .id(dto.getId())
                .password(dto.getPassword())
                .company(company)
                .build();

        adminRepository.save(admin);
    }

    @Transactional
    public void registerCompany(CompanyRegisterRequest dto) {
        if (companyRepository.existsById(dto.getCompanyName())) {
            throw new RuntimeException("이미 존재하는 기업명입니다.");
        }

        Company company = Company.builder()
                .companyName(dto.getCompanyName())
                .address(dto.getAddress())
                .url(dto.getUrl())
                .build();

        companyRepository.save(company);
    }
    
    public List<Company> searchCompanies(String keyword) {
        return companyRepository.findByCompanyNameContaining(keyword);
    }

    public boolean checkAdminIdDuplication(String id) {
        return adminRepository.existsById(id);
    }

    public User loginUser(UserLoginRequest dto) {
        User user = userRepository.findById(dto.getPhoneNumber())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));
        
        if (!user.getPassword().equals(dto.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }
        
        return user;
    }

    public Admin loginAdmin(AdminLoginRequest dto) {
        Admin admin = adminRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 관리자입니다."));

        if (!admin.getPassword().equals(dto.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        return admin;
    }
}