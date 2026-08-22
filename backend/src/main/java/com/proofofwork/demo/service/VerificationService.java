package com.proofofwork.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.proofofwork.demo.entity.Verification;
import com.proofofwork.demo.entity.Work;
import com.proofofwork.demo.repository.VerificationRepository;
import com.proofofwork.demo.repository.WorkRepository;

@Service
public class VerificationService {

    private final VerificationRepository verificationRepository;
    private final WorkRepository workRepository;

    public VerificationService(
            VerificationRepository verificationRepository,
            WorkRepository workRepository) {

        this.verificationRepository = verificationRepository;
        this.workRepository = workRepository;
    }

    public Verification createVerification(Verification verification) {

        // Work ID check
        if (verification.getWork() == null ||
                verification.getWork().getId() == null) {

            throw new RuntimeException("Work ID is required");
        }

        Long workId = verification.getWork().getId();

        // Database se actual Work fetch karo
        Work work = workRepository.findById(workId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Work not found with id: " + workId));

        // Managed Work entity set karo
        verification.setWork(work);

        // Verification time automatically set
        if (verification.getVerifiedAt() == null) {
            verification.setVerifiedAt(LocalDateTime.now());
        }

        return verificationRepository.save(verification);
    }

    public List<Verification> getAllVerifications() {
        return verificationRepository.findAll();
    }

    public Verification getVerificationById(Long id) {
        return verificationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Verification not found with id: " + id));
    }
}
 