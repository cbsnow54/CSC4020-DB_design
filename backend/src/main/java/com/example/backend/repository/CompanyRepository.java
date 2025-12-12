package com.example.backend.repository;

import com.example.backend.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CompanyRepository extends JpaRepository<Company, String> {
    List<Company> findByCompanyNameContaining(String keyword);
}