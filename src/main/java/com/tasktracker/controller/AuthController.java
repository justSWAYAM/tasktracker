package com.tasktracker.controller;

import com.tasktracker.dto.ApiResponse;
import com.tasktracker.dto.RegisterDTO;
import com.tasktracker.dto.LoginDTO;
import com.tasktracker.entity.Student;
import com.tasktracker.service.AuthService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Student>> register(@Valid @RequestBody RegisterDTO registerDTO) {
        logger.info("Registration attempt for email: {}", registerDTO.email());
        return authService.register(registerDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Student>> login(@Valid @RequestBody LoginDTO loginDTO) {
        logger.info("Login attempt for email: {}", loginDTO.email());
        return authService.login(loginDTO);
    }
} 