package com.example.backend.controller;

import com.example.backend.dto.AdConsentRequest;
import com.example.backend.entity.AdConsent;
import com.example.backend.service.AdConsentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ad-consent")
@RequiredArgsConstructor
public class AdConsentController {
    private final AdConsentService adConsentService;

    @PostMapping("/register")
    public ResponseEntity<String> registerConsent(@RequestBody AdConsentRequest request) {
        try {
            adConsentService.registerConsent(request);
            return ResponseEntity.ok("수신 동의 내역이 등록되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/upload-csv")
    public ResponseEntity<String> uploadCsv(
            @RequestParam("file") MultipartFile file,
            @RequestParam("adminId") String adminId
    ) {
        try {
            int count = adConsentService.registerConsentsByCsv(file, adminId);
            return ResponseEntity.ok("총 " + count + "건의 데이터가 처리되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("CSV 업로드 실패: " + e.getMessage());
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<AdConsent>> getConsentList(
            @RequestParam String adminId,
            @RequestParam(defaultValue = "all") String filter
    ) {
        List<AdConsent> list = adConsentService.getConsents(adminId, filter);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/my-list")
    public ResponseEntity<List<AdConsent>> getMyConsents(@RequestParam String phoneNumber) {
        List<AdConsent> list = adConsentService.getMyConsents(phoneNumber);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/withdraw/{consentId}")
    public ResponseEntity<String> withdrawConsent(
            @PathVariable Long consentId, 
            @RequestBody Map<String, String> payload
    ) {
        try {
            String phoneNumber = payload.get("phoneNumber");
            adConsentService.withdrawConsent(consentId, phoneNumber);
            return ResponseEntity.ok("철회가 완료되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/marketing-targets")
    public ResponseEntity<List<String>> getMarketingTargets(@RequestParam String adminId) {
        List<String> targets = adConsentService.getMarketingTargets(adminId);
        return ResponseEntity.ok(targets);
    }
}