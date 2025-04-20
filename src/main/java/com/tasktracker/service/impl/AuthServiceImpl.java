package com.tasktracker.service.impl;

import com.tasktracker.dto.ApiResponse;
import com.tasktracker.dto.LoginDTO;
import com.tasktracker.dto.RegisterDTO;
import com.tasktracker.entity.Student;
import com.tasktracker.repository.StudentRepository;
import com.tasktracker.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public ResponseEntity<ApiResponse<Student>> register(RegisterDTO registerDTO) {
        try {
            if (studentRepository.existsByEmail(registerDTO.email())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error("Email already exists"));
            }

            Student student = new Student();
            student.setName(registerDTO.name());
            student.setEmail(registerDTO.email());
            student.setPassword(passwordEncoder.encode(registerDTO.password()));
            student.setAge(18); // Default age
            student.setStudentClass("Default"); // Default class

            Student savedStudent = studentRepository.save(student);
            return ResponseEntity.ok(ApiResponse.success("Registration successful", savedStudent));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Registration failed: " + e.getMessage()));
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<Student>> login(LoginDTO loginDTO) {
        try {
            Student student = studentRepository.findByEmail(loginDTO.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

            if (!passwordEncoder.matches(loginDTO.password(), student.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid email or password"));
            }

            return ResponseEntity.ok(ApiResponse.success("Login successful", student));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Login failed: " + e.getMessage()));
        }
    }
} 