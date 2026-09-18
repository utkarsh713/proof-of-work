package com.proofofwork.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proofofwork.demo.entity.User;
import com.proofofwork.demo.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // GET USER PROFILE
    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {

        try {

            User user = userRepository.findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("User not found.")
                    );

            return ResponseEntity.ok(createUserResponse(user));

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }

    // UPDATE USER PROFILE
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        try {

            User user = userRepository.findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("User not found.")
                    );

            String name = request.get("name");
            String email = request.get("email");
            String phone = request.get("phone");
            String location = request.get("location");

            if (name == null || email == null) {
                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Name and email are required."
                        ));
            }

            name = name.trim();
            email = email.trim().toLowerCase();

            if (name.isEmpty() || email.isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Name and email cannot be empty."
                        ));
            }

            // Check if another user already has this email
            userRepository.findByEmail(email)
                    .ifPresent(existingUser -> {

                        if (!existingUser.getId().equals(id)) {
                            throw new RuntimeException(
                                    "Email already registered by another user."
                            );
                        }
                    });

            user.setName(name);
            user.setEmail(email);
            user.setPhone(phone);
            user.setLocation(location);

            User savedUser = userRepository.save(user);

            Map<String, Object> response = new HashMap<>();

            response.put(
                    "message",
                    "Profile updated successfully."
            );

            response.put(
                    "user",
                    createUserResponse(savedUser)
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }

    // USER RESPONSE
    private Map<String, Object> createUserResponse(User user) {

        Map<String, Object> data = new HashMap<>();

        data.put("id", user.getId());
        data.put("name", user.getName());
        data.put("email", user.getEmail());
        data.put("phone", user.getPhone());
        data.put("location", user.getLocation());
        data.put("role", user.getRole());

        return data;
    }
}   