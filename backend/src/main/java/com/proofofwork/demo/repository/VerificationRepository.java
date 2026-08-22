package com.proofofwork.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proofofwork.demo.entity.Verification;

public interface VerificationRepository extends JpaRepository<Verification, Long> {
}
