package com.proofofwork.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.proofofwork.demo.entity.Evidence;
import com.proofofwork.demo.repository.EvidenceRepository;

@Service
public class EvidenceService {

    private final EvidenceRepository evidenceRepository;

    public EvidenceService(EvidenceRepository evidenceRepository) {
        this.evidenceRepository = evidenceRepository;
    }

    public Evidence createEvidence(Evidence evidence) {
        return evidenceRepository.save(evidence);
    }

    public List<Evidence> getAllEvidence() {
        return evidenceRepository.findAll();
    }

    public Evidence getEvidenceById(Long id) {
        return evidenceRepository.findById(id).orElse(null);
    }
}