package com.proofofwork.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proofofwork.demo.entity.Evidence;

public interface EvidenceRepository extends JpaRepository<Evidence, Long> {
}