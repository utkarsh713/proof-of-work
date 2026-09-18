package com.proofofwork.demo.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proofofwork.demo.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // =========================================================
    // REGISTER AUTHORITY
    // =========================================================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody Map<String, String> request) {

        try {

            String name = request.get("name");
            String email = request.get("email");
            String location = request.get("location");
            String password = request.get("password");

            // -------------------------------------------------
            // Validate required fields
            // -------------------------------------------------

            if (name == null || name.isBlank()
                    || email == null || email.isBlank()
                    || location == null || location.isBlank()
                    || password == null || password.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Name, email, location and password are required."
                        ));
            }

            // -------------------------------------------------
            // Register authority
            // -------------------------------------------------

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(
                            authService.register(
                                    name.trim(),
                                    email.trim().toLowerCase(),
                                    location.trim(),
                                    password
                            )
                    );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }

    // =========================================================
    // LOGIN AUTHORITY
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> request) {

        try {

            String email = request.get("email");
            String password = request.get("password");

            // -------------------------------------------------
            // Validate fields
            // -------------------------------------------------

            if (email == null || email.isBlank()
                    || password == null || password.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Email and password are required."
                                )
                        );
            }

            // -------------------------------------------------
            // Login
            // -------------------------------------------------

            return ResponseEntity.ok(
                    authService.login(
                            email.trim().toLowerCase(),
                            password
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }
} 