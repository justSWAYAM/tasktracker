package com.tasktracker.service;

import com.tasktracker.dto.ApiResponse;
import com.tasktracker.dto.LoginDTO;
import com.tasktracker.dto.RegisterDTO;
import com.tasktracker.entity.Student;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<ApiResponse<Student>> register(RegisterDTO registerDTO);
    ResponseEntity<ApiResponse<Student>> login(LoginDTO loginDTO);
} 