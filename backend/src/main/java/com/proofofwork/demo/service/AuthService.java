package com.proofofwork.demo.service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.proofofwork.demo.entity.User;
import com.proofofwork.demo.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // =========================================================
    // REGISTER
    // =========================================================

    public Map<String, Object> register(
            String name,
            String email,
            String location,
            String password) {

        // -----------------------------------------------------
        // Validate input
        // -----------------------------------------------------

        if (name == null || name.isBlank()) {
            throw new RuntimeException("Name is required.");
        }

        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email is required.");
        }

        if (location == null || location.isBlank()) {
            throw new RuntimeException("Location is required.");
        }

        if (password == null || password.isBlank()) {
            throw new RuntimeException("Password is required.");
        }

        // -----------------------------------------------------
        // Check duplicate email
        // -----------------------------------------------------

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered.");
        }

        // -----------------------------------------------------
        // Create user
        // -----------------------------------------------------

        User user = new User(
                name,
                email,
                password,
                location
        );

        // -----------------------------------------------------
        // IMPORTANT
        // -----------------------------------------------------
        // Role is ALWAYS AUTHORITY.
        // Frontend cannot create a Citizen account.
        // -----------------------------------------------------

        user.setRole("AUTHORITY");

        // -----------------------------------------------------
        // Save user
        // -----------------------------------------------------

        User savedUser = userRepository.save(user);

        // -----------------------------------------------------
        // Response
        // -----------------------------------------------------

        Map<String, Object> response = new HashMap<>();

        response.put(
                "message",
                "Authority registration successful."
        );

        response.put(
                "user",
                createUserResponse(savedUser)
        );

        return response;
    }

    // =========================================================
    // LOGIN
    // =========================================================

    public Map<String, Object> login(
            String email,
            String password) {

        // -----------------------------------------------------
        // Find user
        // -----------------------------------------------------

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password."
                        )
                );

        // -----------------------------------------------------
        // IMPORTANT
        // Only AUTHORITY accounts can login.
        // -----------------------------------------------------

        if (!"AUTHORITY".equalsIgnoreCase(user.getRole())) {

            throw new RuntimeException(
                    "Only authority accounts can login."
            );
        }

        // -----------------------------------------------------
        // Check password
        // -----------------------------------------------------

        if (!user.getPassword().equals(password)) {

            throw new RuntimeException(
                    "Invalid email or password."
            );
        }

        // -----------------------------------------------------
        // Generate token
        // -----------------------------------------------------

        String token = UUID.randomUUID().toString();

        // -----------------------------------------------------
        // Response
        // -----------------------------------------------------

        Map<String, Object> response = new HashMap<>();

        response.put(
                "message",
                "Login successful."
        );

        response.put(
                "token",
                token
        );

        response.put(
                "user",
                createUserResponse(user)
        );

        return response;
    }

    // =========================================================
    // USER RESPONSE
    // =========================================================

    private Map<String, Object> createUserResponse(User user) {

        Map<String, Object> data = new HashMap<>();

        data.put("id", user.getId());
        data.put("name", user.getName());
        data.put("email", user.getEmail());
        data.put("location", user.getLocation());
        data.put("role", user.getRole());

        return data;
    }
}     