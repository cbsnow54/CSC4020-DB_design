package com.example.backend.service;

import com.example.backend.dto.AdConsentRequest;
import com.example.backend.entity.AdConsent;
import com.example.backend.entity.Admin;
import com.example.backend.repository.AdConsentRepository;
import com.example.backend.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdConsentService {
    private final AdConsentRepository adConsentRepository;
    private final AdminRepository adminRepository;
    
    private static final DateTimeFormatter CSV_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Transactional
    public void registerConsent(AdConsentRequest dto) {
        Admin admin = adminRepository.findById(dto.getAdminId())
                .orElseThrow(() -> new RuntimeException("관리자 정보를 찾을 수 없습니다."));
        
        String companyName = admin.getCompany().getCompanyName();
        LocalDateTime newDate = dto.getSelectedDate() != null ? dto.getSelectedDate() : LocalDateTime.now();

        AdConsent existingConsent = adConsentRepository.findByCompany_CompanyNameAndPhoneNumber(companyName, dto.getPhoneNumber())
                .orElse(null);

        if (existingConsent != null) {
            if (existingConsent.getConsentStatus() == 1) {
                throw new RuntimeException("이미 수신 동의 중인 고객입니다.");
            } else {
                if (newDate.isBefore(existingConsent.getStatusDate())) {
                    throw new RuntimeException("새로운 동의 날짜가 기존 철회 날짜보다 과거일 수 없습니다.");
                }

                existingConsent.reConsent(newDate);
                adConsentRepository.save(existingConsent); 
                return;
            }
        }

        AdConsent adConsent = AdConsent.builder()
                .company(admin.getCompany())
                .phoneNumber(dto.getPhoneNumber())
                .consentStatus(1)
                .statusDate(newDate)
                .build();

        adConsentRepository.save(adConsent);
    }

    @Transactional
    public int registerConsentsByCsv(MultipartFile file, String adminId) {
        int successCount = 0;
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] columns = line.split(",");
                String phoneNumber = columns[0].trim();
                if (phoneNumber.isEmpty() || !phoneNumber.matches("^[0-9]+$")) continue;

                LocalDateTime selectedDate = null;
                if (columns.length > 1 && !columns[1].trim().isEmpty()) {
                    try {
                        selectedDate = LocalDateTime.parse(columns[1].trim(), CSV_DATE_FORMATTER);
                    } catch (DateTimeParseException e) {
                    }
                }

                AdConsentRequest dto = new AdConsentRequest();
                dto.setAdminId(adminId);
                dto.setPhoneNumber(phoneNumber);
                dto.setConsentStatus(1);
                dto.setSelectedDate(selectedDate);
                
                try {
                    registerConsent(dto);
                    successCount++;
                } catch (RuntimeException e) {
                    System.out.println("Skip " + phoneNumber + ": " + e.getMessage());
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("CSV 파일 읽기 실패", e);
        }
        return successCount;
    }

    public List<String> getMarketingTargets(String adminId) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("관리자 정보를 찾을 수 없습니다."));
        String companyName = admin.getCompany().getCompanyName();
        return adConsentRepository.findByCompany_CompanyNameAndConsentStatus(companyName, 1)
                .stream().map(AdConsent::getPhoneNumber).toList();
    }

    public List<AdConsent> getConsents(String adminId, String filter) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("관리자 정보를 찾을 수 없습니다."));
        String companyName = admin.getCompany().getCompanyName();
        if ("active".equals(filter)) {
            return adConsentRepository.findByCompany_CompanyNameAndConsentStatus(companyName, 1);
        } else if ("withdrawn".equals(filter)) {
            return adConsentRepository.findByCompany_CompanyNameAndConsentStatus(companyName, 0);
        } else {
            return adConsentRepository.findByCompany_CompanyName(companyName);
        }
    }

    public List<AdConsent> getMyConsents(String phoneNumber) {
        return adConsentRepository.findByPhoneNumber(phoneNumber);
    }

    @Transactional
    public void withdrawConsent(Long consentId, String phoneNumber) {
        AdConsent adConsent = adConsentRepository.findById(consentId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 내역입니다."));
        if (!adConsent.getPhoneNumber().equals(phoneNumber)) throw new RuntimeException("본인만 철회 가능");
        if (adConsent.getConsentStatus() == 0) throw new RuntimeException("이미 철회됨");
        adConsent.withdraw();
    }
}