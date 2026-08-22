package com.proofofwork.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proofofwork.demo.entity.Verification;
import com.proofofwork.demo.service.VerificationService;

@RestController
@RequestMapping("/api/verification")
@CrossOrigin(origins = "*")
public class VerificationController {

    private final VerificationService verificationService;

    public VerificationController(VerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @PostMapping
    public Verification createVerification(
            @RequestBody Verification verification) {

        return verificationService.createVerification(verification);
    }

    @GetMapping
    public List<Verification> getAllVerifications() {
        return verificationService.getAllVerifications();
    }

    @GetMapping("/{id}")
    public Verification getVerificationById(
            @PathVariable Long id) {

        return verificationService.getVerificationById(id);
    }
}
