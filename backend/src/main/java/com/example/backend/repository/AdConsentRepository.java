package com.example.backend.repository;

import com.example.backend.entity.AdConsent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AdConsentRepository extends JpaRepository<AdConsent, Long> {
    List<AdConsent> findByCompany_CompanyName(String companyName);
    List<AdConsent> findByCompany_CompanyNameAndConsentStatus(String companyName, Integer consentStatus);
    List<AdConsent> findByPhoneNumber(String phoneNumber);

    Optional<AdConsent> findByCompany_CompanyNameAndPhoneNumber(String companyName, String phoneNumber);
}