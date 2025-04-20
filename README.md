# Last Minute Study Helper

A web application to help students prepare for exams by providing important topics and questions.

## Features

- Subject management
- Question bank
- Dark theme UI
- Responsive design

## Prerequisites

- Java 17
- PostgreSQL
- Maven

## Setup

1. Create a PostgreSQL database named `tasktracker`
2. Update the database credentials in `src/main/resources/application.properties` if needed
3. Build the application:
   ```bash
   mvn clean install
   ```
4. Run the application:
   ```bash
   mvn spring-boot:run
   ```

## API Endpoints

- GET `/api/subjects` - Get all subjects
- GET `/api/subjects/{id}` - Get subject by ID
- POST `/api/subjects` - Create a new subject
- DELETE `/api/subjects/{id}` - Delete a subject

## Frontend

The frontend is built with React and is served from the Spring Boot application. Access it at:
```
cd frontend
npm run dev
http://localhost:8080
```

## Development

- Backend: Java Spring Boot
- Frontend: React
- Database: PostgreSQL 