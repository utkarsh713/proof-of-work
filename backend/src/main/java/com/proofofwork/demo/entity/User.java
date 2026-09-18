package com.proofofwork.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    // =========================================================
    // ID
    // =========================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =========================================================
    // BASIC USER INFORMATION
    // =========================================================

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    // Phone number is used in Profile Settings
    private String phone;

    private String location;


    // =========================================================
    // USER ROLE
    // =========================================================

    @Column(nullable = false)
    private String role;


    // =========================================================
    // DEFAULT CONSTRUCTOR
    // Required by JPA
    // =========================================================

    public User() {
        this.role = "AUTHORITY";
    }


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public User(
            String name,
            String email,
            String password,
            String location
    ) {

        this.name = name;
        this.email = email;
        this.password = password;
        this.location = location;

        // Every registered account is an AUTHORITY.
        this.role = "AUTHORITY";
    }


    // =========================================================
    // GET ID
    // =========================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    // =========================================================
    // GET / SET NAME
    // =========================================================

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    // =========================================================
    // GET / SET EMAIL
    // =========================================================

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    // =========================================================
    // GET / SET PASSWORD
    // =========================================================

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    // =========================================================
    // GET / SET PHONE
    // =========================================================

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }


    // =========================================================
    // GET / SET LOCATION
    // =========================================================

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }


    // =========================================================
    // GET / SET ROLE
    // =========================================================

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
} 