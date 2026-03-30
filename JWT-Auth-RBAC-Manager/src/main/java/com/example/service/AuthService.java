package com.example.service;

import com.example.DTO.*;
import com.example.entity.Role;
import com.example.entity.User;
import com.example.repository.UserRepository;
import com.example.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository repo;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository repo, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.repo = repo;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public void register(RegisterRequest request) {

        if (repo.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Role role;
        if (request.getRole() == null || request.getRole().isEmpty()) {
            role = Role.USER;
        } else {
            role = Role.valueOf(request.getRole().toUpperCase());
        }

        user.setRole(role);

        repo.save(user);
    }

    public AuthResponse login(LoginRequest request) {

        User user = repo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("Entered password: " + request.getPassword());
        System.out.println("DB password: " + user.getPassword());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(token);
    }
}