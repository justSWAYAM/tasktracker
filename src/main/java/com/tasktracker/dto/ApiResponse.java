package com.tasktracker.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ApiResponse<T> {
    private String result;
    private String message;
    private T data;

    public ApiResponse(String result, String message, T data) {
        this.result = result;
        this.message = message;
        this.data = data;
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<T>("success", message, data);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<T>("error", message, null);
    }
} 