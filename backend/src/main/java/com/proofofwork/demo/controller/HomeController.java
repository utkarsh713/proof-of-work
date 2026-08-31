package com.proofofwork.demo.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {

        return Map.of(
                "application", "Proof of Work",
                "status", "Backend is running",
                "message", "Proof of Work API is online",
                "port", 8080
        );
    }
} 