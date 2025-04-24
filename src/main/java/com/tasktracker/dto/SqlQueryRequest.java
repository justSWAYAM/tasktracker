package com.tasktracker.dto;

import jakarta.validation.constraints.NotBlank;

public record SqlQueryRequest(
    @NotBlank(message = "SQL query is required")
    String query
) {
    public SqlQueryRequest {
        if (query == null) {
            throw new IllegalArgumentException("Query cannot be null");
        }
    }
} 