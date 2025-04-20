package com.tasktracker.config;

import com.tasktracker.entity.Student;
import com.tasktracker.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        try {
            logger.info("Starting data initialization...");
            long studentCount = studentRepository.count();
            logger.info("Current number of students in database: {}", studentCount);

            if (studentCount == 0) {
                logger.info("No students found. Creating initial data...");
                
                // Create sample admin student
                Student admin = new Student();
                admin.setName("Admin User");
                admin.setEmail("admin@example.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setAge(25);
                admin.setStudentClass("Admin");

                // Save admin
                studentRepository.save(admin);
                logger.info("Successfully created admin user");
            } else {
                logger.info("Students already exist in the database. Skipping initialization.");
            }
        } catch (Exception e) {
            logger.error("Error during data initialization: {}", e.getMessage(), e);
        }
    }
} 