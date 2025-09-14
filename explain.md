# LastMinute Study Helper Project Architecture Documentation

## Table of Contents
1. [Maven Architecture](#maven-architecture)
2. [Spring Boot Components](#spring-boot-components)
3. [Spring Core Concepts](#spring-core-concepts)
4. [Database Architecture](#database-architecture)
5. [Security Implementation](#security-implementation)
6. [Project Structure](#project-structure)
7. [Code Snippets](#code-snippets)

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

### DAO (Data Access Objects)
Location: `src/main/java/com/tasktracker/dao/`

DAOs provide an abstraction layer between the application and the database. While we primarily use Spring Data JPA repositories, DAOs are used for complex database operations that require custom implementations.

Example DAO Interface:
```java
// filepath: src/main/java/com/tasktracker/dao/StudentDao.java
public interface StudentDao {
    List<Student> findByGradeAndSport(String grade, String sport);
    void bulkInsert(List<Student> students);
    Map<String, Object> getStudentStatistics();
}
```

Implementation:
```java
// filepath: src/main/java/com/tasktracker/dao/StudentDaoImpl.java
@Repository
public class StudentDaoImpl implements StudentDao {
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public List<Student> findByGradeAndSport(String grade, String sport) {
        String jpql = "SELECT s FROM Student s JOIN s.sport sp " +
                     "WHERE s.grade = :grade AND sp.name = :sport";
        return entityManager.createQuery(jpql, Student.class)
                          .setParameter("grade", grade)
                          .setParameter("sport", sport)
                          .getResultList();
    }

    @Override
    @Transactional
    public void bulkInsert(List<Student> students) {
        for (int i = 0; i < students.size(); i++) {
            entityManager.persist(students.get(i));
            if (i % 50 == 0) {
                entityManager.flush();
                entityManager.clear();
            }
        }
    }

    @Override
    public Map<String, Object> getStudentStatistics() {
        String sql = "SELECT COUNT(*) as total, " +
                    "AVG(CASE WHEN grade='A' THEN 1 ELSE 0 END) as aGradePercent " +
                    "FROM students";
        Query query = entityManager.createNativeQuery(sql);
        Object[] result = (Object[]) query.getSingleResult();
        
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalStudents", result[0]);
        statistics.put("aGradePercentage", result[1]);
        return statistics;
    }
}
```

Usage in Service Layer:
```java
// filepath: src/main/java/com/tasktracker/service/StudentService.java
@Service
public class StudentService {
    private final StudentDao studentDao;
    
    @Autowired
    public StudentService(StudentDao studentDao) {
        this.studentDao = studentDao;
    }
    
    public Map<String, Object> getStudentAnalytics() {
        return studentDao.getStudentStatistics();
    }
    
    public void importStudents(List<Student> students) {
        studentDao.bulkInsert(students);
    }
}
```

Key Differences between DAO and Repository:
1. **Abstraction Level**:
   - DAO: Lower-level, closer to the database
   - Repository: Higher-level, domain-focused

2. **Usage**:
   - DAO: Complex queries, bulk operations, native SQL
   - Repository: Basic CRUD operations, simple queries

3. **Implementation**:
   - DAO: Custom implementation required
   - Repository: Spring provides implementation

Current DAO Usage in Project:
- Complex SQL queries for analytics
- Bulk data operations
- Custom database operations not covered by JPA repositories

## Spring Core Concepts

### Spring Beans
Spring Beans are the backbone of a Spring application:

- **Definition**: Objects managed by the Spring IoC (Inversion of Control) container
- **Scope Types**:
  - Singleton (default): One instance per Spring container
  - Prototype: New instance each time requested
  - Request: One instance per HTTP request
  - Session: One instance per HTTP session

Example:
```java
@Component
public class UserService {
    @Autowired
    private UserRepository userRepository;
}
```

### Spring MVC
Spring MVC (Model-View-Controller) is the web framework for building web applications:

- **Components**:
  - **DispatcherServlet**: Front controller that handles all HTTP requests
  - **Controllers**: Handle requests and return responses
  - **ViewResolver**: Resolves view names to actual views
  - **Models**: Hold application data

Example:
```java
@Controller
public class HomeController {
    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("message", "Welcome");
        return "home";
    }
}
```

### AOP (Aspect-Oriented Programming)
AOP enables separation of cross-cutting concerns:

- **Key Concepts**:
  - **Aspect**: Modularization of cross-cutting concerns
  - **Join Point**: Point in program execution
  - **Advice**: Action taken at join point
  - **Pointcut**: Expression that selects join points

Example:
```java
@Aspect
@Component
public class LoggingAspect {
    @Around("execution(* com.tasktracker.service.*.*(..))")
    public Object logMethodExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        // Logging logic
        return joinPoint.proceed();
    }
}
```

Common AOP Use Cases:
- Logging
- Transaction management
- Security
- Caching
- Error handling

### Inversion of Control (IoC)
IoC is a fundamental principle in Spring where control of object creation and lifecycle is inverted to the Spring container.

Examples from our project:

1. Constructor Injection in Controllers:
```java
// filepath: src/main/java/com/tasktracker/controller/SqlPracticeController.java
@RestController
@RequestMapping("/api/sql-practice")
public class SqlPracticeController {
    private final SqlPracticeService sqlPracticeService;

    @Autowired
    public SqlPracticeController(SqlPracticeService sqlPracticeService) {
        this.sqlPracticeService = sqlPracticeService;
    }
}
```

2. Field Injection in Services:
```java
// filepath: src/main/java/com/tasktracker/service/TableDataGeneratorService.java
@Service
public class TableDataGeneratorService {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Value("${gemini.api.key}")
    private String apiKey;
}
```

### Spring Beans Implementation
Current bean implementations in our project:

1. Service Beans:
```java
// filepath: src/main/java/com/tasktracker/service/StudentService.java
@Service
@Transactional
public class StudentService {
    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }
}
```

2. Repository Beans:
```java
// filepath: src/main/java/com/tasktracker/repository/StudentRepository.java
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    @EntityGraph(attributePaths = {"sport"})
    List<Student> findAll();
}
```

3. Configuration Beans:
```java
// filepath: src/main/java/com/tasktracker/config/WebConfig.java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

### Spring MVC Implementation
Current MVC components in our project:

1. Controllers (View Controllers):
```java
// filepath: src/main/java/com/tasktracker/controller/HomeController.java
@Controller
public class HomeController {
    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("pageTitle", "TaskTracker Home");
        return "home";
    }
}
```

2. REST Controllers:
```java
// filepath: src/main/java/com/tasktracker/controller/ApiController.java
@RestController
@RequestMapping("/api")
public class ApiController {
    @PostMapping("/execute")
    public ResponseEntity<?> executeQuery(@Valid @RequestBody SqlQueryRequest request) {
        // Implementation
    }
}
```

### AOP Implementation Points
While we haven't fully implemented AOP, here are recommended implementation points:

1. Logging Aspect:
```java
// filepath: src/main/java/com/tasktracker/aspect/LoggingAspect.java
@Aspect
@Component
public class LoggingAspect {
    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    @Around("execution(* com.tasktracker.service.*.*(..))")
    public Object logMethodExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        logger.info("Executing: {}", joinPoint.getSignature().getName());
        return joinPoint.proceed();
    }
}
```

2. Performance Monitoring:
```java
// filepath: src/main/java/com/tasktracker/aspect/PerformanceAspect.java
@Aspect
@Component
public class PerformanceAspect {
    @Around("@annotation(com.tasktracker.annotation.MonitorPerformance)")
    public Object measureExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        Object proceed = joinPoint.proceed();
        long executionTime = System.currentTimeMillis() - start;
        System.out.println(joinPoint.getSignature() + " executed in " + executionTime + "ms");
        return proceed;
    }
}
```

### Configuration Management
Our IoC container configuration:

```java
// filepath: src/main/java/com/tasktracker/config/AppConfig.java
@Configuration
@EnableAspectJAutoProxy
public class AppConfig {
    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
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
