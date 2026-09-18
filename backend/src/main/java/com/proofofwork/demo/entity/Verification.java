package com.proofofwork.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "verification")
public class Verification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String status;

    private Double aiScore;

    private Boolean timestampCheck;

    private Boolean gpsCheck;

    private String remarks;

    private LocalDateTime verifiedAt;

    @OneToOne
    @JoinColumn(name = "work_id")
    private Work work;

    public Verification() {
    }

    public Verification(
            String status,
            Double aiScore,
            Boolean timestampCheck,
            Boolean gpsCheck,
            String remarks,
            LocalDateTime verifiedAt,
            Work work
    ) {
        this.status = status;
        this.aiScore = aiScore;
        this.timestampCheck = timestampCheck;
        this.gpsCheck = gpsCheck;
        this.remarks = remarks;
        this.verifiedAt = verifiedAt;
        this.work = work;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getAiScore() {
        return aiScore;
    }

    public void setAiScore(Double aiScore) {
        this.aiScore = aiScore;
    }

    public Boolean getTimestampCheck() {
        return timestampCheck;
    }

    public void setTimestampCheck(Boolean timestampCheck) {
        this.timestampCheck = timestampCheck;
    }

    public Boolean getGpsCheck() {
        return gpsCheck;
    }

    public void setGpsCheck(Boolean gpsCheck) {
        this.gpsCheck = gpsCheck;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }

    public Work getWork() {
        return work;
    }

    public void setWork(Work work) {
        this.work = work;
    }
}