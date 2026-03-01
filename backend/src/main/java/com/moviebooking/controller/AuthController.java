package com.moviebooking.controller;

import com.moviebooking.dto.AuthResponse;
import com.moviebooking.dto.LoginRequest;
import com.moviebooking.dto.RegisterRequest;
import com.moviebooking.model.User;
import com.moviebooking.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody RegisterRequest request) {
        User user = authService.register(request);
        user.setPassword(null); // Don't expose password hash
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = authService.getProfile(email);
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }
}
