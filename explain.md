 # TaskTracker Project Architecture Documentation

## Table of Contents
1. [Maven Architecture](#maven-architecture)
2. [Spring Boot Components](#spring-boot-components)
3. [Database Architecture](#database-architecture)
4. [Security Implementation](#security-implementation)
5. [Project Structure](#project-structure)
6. [Code Snippets](#code-snippets)

## Maven Architecture

The project uses Maven as its build and dependency management tool. Key aspects:

- **Project Object Model (POM)**: Located in `pom.xml`
- **Dependencies**: Managed through Maven's dependency management
- **Build Lifecycle**: Standard Maven lifecycle phases (compile, test, package, install)
- **Plugins**: Various Maven plugins for different build tasks

## Spring Boot Components

### Controllers
Location: `src/main/java/com/tasktracker/controller/`

Controllers handle HTTP requests and responses. They are annotated with `@RestController` and use various HTTP method annotations (`@GetMapping`, `@PostMapping`, etc.).

Example:
```java
@RestController
@RequestMapping("/api/sql-practice")
public class SqlPracticeController {
    @Autowired
    private SqlPracticeService sqlPracticeService;
    
    @PostMapping("/execute")
    public ResponseEntity<?> executeQuery(@RequestBody SqlQueryRequest request) {
        // Implementation
    }
}
```

### Services
Location: `src/main/java/com/tasktracker/service/`

Services contain business logic and are annotated with `@Service`. They handle data processing and business rules.

Example:
```java
@Service
public class TableDataGeneratorService {
    @Value("${gemini.api.key}")
    private String apiKey;
    
    public List<Map<String, Object>> generateTableData(String tableName, List<String> columnNames) {
        // Implementation
    }
}
```

### Repositories
Location: `src/main/java/com/tasktracker/repository/`

Repositories handle database operations using Spring Data JPA. They extend `JpaRepository` and use JPQL for custom queries.

Example:
```java
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    @Query("SELECT s FROM Student s WHERE s.name = :name")
    List<Student> findByName(@Param("name") String name);
}
```

### Entities
Location: `src/main/java/com/tasktracker/entity/`

Entities represent database tables and are annotated with `@Entity`. They use JPA annotations for mapping.

Example:
```java
@Entity
@Data
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sport_id")
    private Sport sport;
}
```

### DTOs (Data Transfer Objects)
Location: `src/main/java/com/tasktracker/dto/`

DTOs are used for data transfer between layers. They are implemented as records and include validation.

Example:
```java
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
```

## Database Architecture

### JPA and Hibernate
- **JPA**: Used for ORM (Object-Relational Mapping)
- **Hibernate**: Default JPA implementation
- **Entity Relationships**: Managed through JPA annotations
- **Lazy Loading**: Used for performance optimization

### Database Operations
- **CRUD Operations**: Handled through JpaRepository
- **Custom Queries**: Implemented using JPQL
- **Transactions**: Managed through `@Transactional` annotation

## Security Implementation

### JWT (Not Implemented)
The project currently does not implement JWT authentication.

## Project Structure

```
src/main/java/com/tasktracker/
├── config/           # Configuration classes
├── controller/       # REST controllers
├── dto/             # Data Transfer Objects
├── entity/          # JPA entities
├── repository/      # JPA repositories
├── service/         # Business logic
└── TaskTrackerApplication.java
```

## Code Snippets

### AOP (Not Implemented)
The project does not currently use Aspect-Oriented Programming.

### API Handling
```java
@RestController
@RequestMapping("/api/sql-practice")
public class SqlPracticeController {
    @PostMapping("/execute")
    public ResponseEntity<?> executeQuery(@RequestBody SqlQueryRequest request) {
        try {
            // Implementation
            return ResponseEntity.ok()
                .body(new ApiResponse<>("SUCCESS", "Query executed successfully", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("ERROR", e.getMessage(), null));
        }
    }
}
```

### Database Handling
```java
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    @EntityGraph(attributePaths = {"sport"})
    List<Student> findAll();
}
```

### Beans
Beans are managed through Spring's dependency injection:
```java
@Service
public class TableDataGeneratorService {
    @Autowired
    private JdbcTemplate jdbcTemplate;
}
```

## Maven Status
The project uses Maven for:
- Dependency management
- Build automation
- Project documentation
- Testing
- Packaging

Key dependencies:
- Spring Boot
- Spring Data JPA
- PostgreSQL
- Lombok
- Thymeleaf

## DTO Functions
DTOs in this project serve several purposes:
1. Data validation
2. Data transfer between layers
3. Encapsulation of request/response data
4. Prevention of direct entity exposure
5. Custom data formatting

Current DTOs:
- `SqlQueryRequest`: For SQL query execution
- `TableCreationRequest`: For custom table creation
- `ApiResponse`: Standard response format

## Entity Classes
Current entities:
1. `Student`
2. `Sport`
3. `Country`
4. `Athlete`

Each entity follows JPA best practices with proper annotations and relationships.