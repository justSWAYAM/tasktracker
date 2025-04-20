package com.tasktracker.dto;

import jakarta.validation.constraints.*;

public record StudentDTO(
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    String name,
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    String email,
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    String password,
    
    @NotNull(message = "Age is required")
    @Min(value = 5, message = "Age must be at least 5")
    @Max(value = 100, message = "Age must be less than 100")
    Integer age,
    
    @NotBlank(message = "Class is required")
    String studentClass
) {
    public StudentDTO {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name cannot be null or blank");
        }
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email cannot be null or blank");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password cannot be null or blank");
        }
        if (age == null) {
            throw new IllegalArgumentException("Age cannot be null");
        }
        if (studentClass == null || studentClass.isBlank()) {
            throw new IllegalArgumentException("Class cannot be null or blank");
        }
    }
} 