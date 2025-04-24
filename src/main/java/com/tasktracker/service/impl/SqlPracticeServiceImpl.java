package com.tasktracker.service.impl;

import com.tasktracker.dto.SqlQueryRequest;
import com.tasktracker.service.SqlPracticeService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

@Service
public class SqlPracticeServiceImpl implements SqlPracticeService {

    private static final Set<String> RESTRICTED_TABLES = Set.of(
        "users",
        "user_roles",
        "authentication",
        "password_reset_tokens",
        "system_tables"
    );

    private static final Set<String> RESTRICTED_OPERATIONS = Set.of(
        "DROP",
        "TRUNCATE",
        "GRANT",
        "REVOKE",
        "COPY",
        "ALTER SYSTEM"
    );

    private static final Pattern SQL_INJECTION_PATTERN = Pattern.compile(
        "('(''|[^'])*')|(;)|(--)|(/\\*)|(\\*/)|(\\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE)?|INSERT( +INTO)?|MERGE|SELECT|UPDATE)\\b)",
        Pattern.CASE_INSENSITIVE
    );

    @Autowired
    private EntityManager entityManager;

    @Override
    @Transactional
    public List<Map<String, Object>> executeQuery(SqlQueryRequest request) {
        validateQuery(request.query());
        Query query = entityManager.createNativeQuery(request.query());
        return query.getResultList();
    }

    private void validateQuery(String query) {
        // Check for SQL injection patterns
        if (SQL_INJECTION_PATTERN.matcher(query).find()) {
            throw new IllegalArgumentException("Invalid SQL query: Potential SQL injection detected");
        }

        // Check for restricted operations
        String upperQuery = query.toUpperCase();
        for (String operation : RESTRICTED_OPERATIONS) {
            if (upperQuery.contains(operation)) {
                throw new IllegalArgumentException("Operation not allowed: " + operation);
            }
        }

        // Check for restricted tables
        for (String table : RESTRICTED_TABLES) {
            if (upperQuery.contains(table.toUpperCase())) {
                throw new IllegalArgumentException("Access to table not allowed: " + table);
            }
        }
    }
} 