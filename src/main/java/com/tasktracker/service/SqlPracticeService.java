package com.tasktracker.service;

import com.tasktracker.dto.SqlQueryRequest;
import java.util.List;
import java.util.Map;

public interface SqlPracticeService {
    List<Map<String, Object>> executeQuery(SqlQueryRequest request);
} 