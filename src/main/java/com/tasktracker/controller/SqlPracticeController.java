package com.tasktracker.controller;

import com.tasktracker.dto.SqlQueryRequest;
import com.tasktracker.service.SqlPracticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/sql-practice")
public class SqlPracticeController {

    @Autowired
    private SqlPracticeService sqlPracticeService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final Pattern DANGEROUS_PATTERNS = Pattern.compile(
        "(?i)(DROP|DELETE|TRUNCATE|UPDATE|INSERT|ALTER|CREATE|GRANT|REVOKE|\\bEXEC\\b|\\bEXECUTE\\b|\\bUNION\\b|;|--|/\\*|\\*/|\\bOR\\b|\\bAND\\b|\\bWHERE\\b.*\\bOR\\b|\\bWHERE\\b.*\\bAND\\b)"
    );

    @PostMapping("/execute")
    public ResponseEntity<?> executeQuery(@RequestBody SqlQueryRequest request) {
        try {
            // Validate query
            if (request.query() == null || request.query().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("ERROR", "Query cannot be empty", null));
            }

            String query = request.query().trim().toUpperCase();
            
            // Check if query starts with SELECT
            if (!query.startsWith("SELECT")) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("ERROR", "Only SELECT queries are allowed", null));
            }

            // Check for dangerous operations
            if (DANGEROUS_PATTERNS.matcher(query).find()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("ERROR", "This operation is not allowed for security reasons", null));
            }

            // Execute query
            List<Map<String, Object>> result = jdbcTemplate.queryForList(request.query());
            return ResponseEntity.ok()
                .body(new ApiResponse<>("SUCCESS", "Query executed successfully", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("ERROR", e.getMessage(), null));
        }
    }

    @GetMapping("/tables")
    public List<Map<String, Object>> getTables() {
        String sql = "SELECT table_name FROM information_schema.tables " +
                    "WHERE table_schema = 'public' " +
                    "AND table_name NOT IN ('students', 'subjects', 'questions') " +
                    "ORDER BY table_name";
        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/table/{tableName}")
    public ResponseEntity<?> getTableData(@PathVariable String tableName) {
        try {
            String sql = "SELECT * FROM " + tableName;
            List<Map<String, Object>> data = jdbcTemplate.queryForList(sql);
            return ResponseEntity.ok()
                .body(new ApiResponse<>("SUCCESS", "Table data retrieved successfully", data));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new ApiResponse<>("ERROR", "Failed to retrieve table data", null));
        }
    }
}

record ApiResponse<T>(String result, String message, T data) {} 