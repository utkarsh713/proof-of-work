package com.proofofwork.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proofofwork.demo.entity.Evidence;
import com.proofofwork.demo.service.EvidenceService;

@RestController
@RequestMapping("/api/evidence")
public class EvidenceController {

    private final EvidenceService evidenceService;

    public EvidenceController(EvidenceService evidenceService) {
        this.evidenceService = evidenceService;
    }

    @PostMapping
    public ResponseEntity<Evidence> createEvidence(@RequestBody Evidence evidence) {
        Evidence savedEvidence = evidenceService.createEvidence(evidence);
        return ResponseEntity.ok(savedEvidence);
    }

    @GetMapping
    public ResponseEntity<List<Evidence>> getAllEvidence() {
        return ResponseEntity.ok(evidenceService.getAllEvidence());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Evidence> getEvidenceById(@PathVariable Long id) {

        Evidence evidence = evidenceService.getEvidenceById(id);

        if (evidence == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(evidence);
    }
}