package com.proofofwork.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proofofwork.demo.entity.Work;

public interface WorkRepository extends JpaRepository<Work, Long> {
}
