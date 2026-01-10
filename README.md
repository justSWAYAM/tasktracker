# Task Tracker - SQL Practice & Study Helper Platform

A comprehensive full-stack web application designed to help students practice SQL queries and prepare for exams. The platform provides an interactive SQL practice environment with real-time query execution, user authentication, and a modern, responsive user interface.

## 🎯 Project Overview

Task Tracker is an educational platform that combines SQL practice capabilities with study management features. It allows students to:
- Practice SQL queries in a safe, controlled environment
- Execute SELECT queries against sample databases
- View database table structures and data
- Manage their study sessions with authentication
- Access paper analysis and study materials

## ✨ Key Features

### 🔐 User Authentication
- Secure user registration and login system
- JWT-based authentication (configured)
- Password encryption using BCrypt
- Session management with localStorage
- Protected routes for authenticated users

### 💾 SQL Practice Environment
- **Interactive SQL Query Editor**: Write and execute SQL queries in real-time
- **Query Validation**: Only SELECT queries are allowed for security
- **Security Restrictions**: Prevents dangerous operations (DROP, DELETE, UPDATE, INSERT, etc.)
- **Table Browser**: View available tables and their data
- **Query Results Display**: Beautiful, responsive table view for query results
- **Keyboard Shortcuts**: Execute queries with Ctrl+Enter or Cmd+Enter
- **Layout Toggle**: Switch between horizontal and vertical layouts

### 📊 Database Management
- Sample databases with realistic data (Countries, Sports, Athletes)
- Dynamic table discovery
- Table data preview
- Schema visualization

### 🎨 Modern UI/UX
- Dark theme with beautiful color palette
- Responsive design for all screen sizes
- ReactFlow background animations
- Smooth transitions and hover effects
- Custom scrollbars
- Loading states and error handling

### 📚 Study Features
- Paper Analysis module
- Dashboard with feature overview
- Protected study routes

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.4.4
- **Language**: Java 24
- **Build Tool**: Maven
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security with JWT support
- **Validation**: Jakarta Validation
- **Utilities**: Lombok

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 6.3.1
- **Routing**: React Router DOM 7.5.1
- **Styling**: TailwindCSS 4.1.4
- **HTTP Client**: Axios 1.8.4
- **Visualization**: ReactFlow 11.11.4
- **AI Integration**: Google Generative AI SDK (configured)

### Database
- **Primary**: PostgreSQL
- **Development**: H2 (optional, for testing)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java**: JDK 24 or higher
- **Node.js**: v18 or higher (for frontend)
- **npm** or **yarn**: Package manager
- **PostgreSQL**: 12 or higher
- **Maven**: 3.6+ (or use the included Maven wrapper)

## 🚀 Getting Started

### 1. Database Setup

1. Install and start PostgreSQL on your system
2. Create a new database:
   ```sql
   CREATE DATABASE tasktracker;
   ```
3. The application will automatically create tables using JPA/Hibernate on first run, or you can run the schema scripts manually:
   ```bash
   psql -U postgres -d tasktracker -f src/main/resources/schema.sql
   psql -U postgres -d tasktracker -f src/main/resources/data.sql
   ```

### 2. Backend Configuration

1. Update database credentials in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/tasktracker
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

2. Build the backend:
   ```bash
   mvn clean install
   ```

3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   
   Or use the Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **API Documentation**: Check the controllers for available endpoints

## 📡 API Endpoints

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "age": 20,
    "studentClass": "Class 10"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### SQL Practice Endpoints

- `POST /api/sql-practice/execute` - Execute a SQL query
  ```json
  {
    "query": "SELECT * FROM countries WHERE population > 100000000"
  }
  ```
  **Note**: Only SELECT queries are allowed. Dangerous operations are blocked.

- `GET /api/sql-practice/tables` - Get list of available tables

- `GET /api/sql-practice/table/{tableName}` - Get data from a specific table

## 🗄️ Database Schema

### Core Tables

#### Students Table
- `id` (Primary Key)
- `name` (String, 2-50 characters)
- `email` (String, unique)
- `password` (String, encrypted)
- `age` (Integer, 5-100)
- `studentClass` (String)
- `created_at` (Timestamp)

#### Practice Tables (for SQL exercises)
- **countries**: Country data with name, code, and population
- **sports**: Sports information with name, description, and category
- **athletes**: Athlete records linked to countries and sports

## 🔒 Security Features

1. **Query Validation**: Only SELECT queries are permitted
2. **Pattern Matching**: Blocks dangerous SQL operations:
   - DROP, DELETE, TRUNCATE, UPDATE, INSERT
   - ALTER, CREATE, GRANT, REVOKE
   - UNION-based attacks
   - SQL injection patterns
3. **CORS Configuration**: Configured for frontend origin
4. **Password Encryption**: BCrypt hashing
5. **Input Validation**: Jakarta Validation on all DTOs

## 📁 Project Structure

```
tasktracker/
├── src/
│   ├── main/
│   │   ├── java/com/tasktracker/
│   │   │   ├── config/          # Configuration classes
│   │   │   │   ├── CorsFilter.java
│   │   │   │   ├── DataInitializer.java
│   │   │   │   ├── JacksonConfig.java
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   └── WebConfig.java
│   │   │   ├── controller/      # REST controllers
│   │   │   │   ├── AuthController.java
│   │   │   │   └── SqlPracticeController.java
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── ApiResponse.java
│   │   │   │   ├── AuthRequest.java
│   │   │   │   ├── LoginDTO.java
│   │   │   │   ├── RegisterDTO.java
│   │   │   │   ├── SqlQueryRequest.java
│   │   │   │   └── StudentDTO.java
│   │   │   ├── entity/          # JPA entities
│   │   │   │   ├── Athlete.java
│   │   │   │   ├── Country.java
│   │   │   │   ├── Sport.java
│   │   │   │   └── Student.java
│   │   │   ├── repository/      # Data repositories
│   │   │   │   └── StudentRepository.java
│   │   │   ├── service/         # Business logic
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── SqlPracticeService.java
│   │   │   │   ├── TableDataGeneratorService.java
│   │   │   │   └── impl/
│   │   │   │       ├── AuthServiceImpl.java
│   │   │   │       └── SqlPracticeServiceImpl.java
│   │   │   └── TaskTrackerApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── schema.sql
│   │       └── data.sql
│   └── test/                    # Test files
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── CreateTableDialog.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── pages/               # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── PaperAnalysis.jsx
│   │   │   └── SqlPractice.jsx
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # Entry point
│   ├── package.json
│   └── vite.config.js
├── pom.xml                      # Maven configuration
└── README.md
```

## 🎨 UI Features

### Dashboard
- Welcome screen with user greeting
- Feature cards with navigation
- Beautiful gradient backgrounds
- ReactFlow animated patterns
- Responsive grid layout

### SQL Practice Page
- Split-pane layout (query editor + results)
- Syntax highlighting ready
- Table browser with click-to-view
- Real-time query execution
- Error handling with user-friendly messages
- Success animations
- Custom scrollbars
- Layout toggle functionality

## 🧪 Development

### Running Tests
```bash
mvn test
```

### Building for Production

**Backend:**
```bash
mvn clean package
java -jar target/tasktracker-0.0.1-SNAPSHOT.jar
```

**Frontend:**
```bash
cd frontend
npm run build
```

### Code Quality
- ESLint configured for frontend
- Spring Boot validation for backend
- Comprehensive error handling

## 🔧 Configuration

### Backend Configuration (`application.properties`)
- Database connection settings
- JPA/Hibernate configuration
- Server port (default: 8080)
- Logging levels

### Frontend Configuration
- Vite dev server on port 5173
- API base URL: `http://localhost:8080`
- TailwindCSS for styling

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check credentials in `application.properties`
   - Ensure database `tasktracker` exists

2. **Port Already in Use**
   - Change port in `application.properties` (backend)
   - Change port in `vite.config.js` (frontend)

3. **CORS Errors**
   - Verify frontend origin matches CORS configuration
   - Check `SecurityConfig.java` for allowed origins

4. **Query Execution Errors**
   - Ensure query starts with SELECT
   - Check for blocked keywords
   - Verify table names exist

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available for educational purposes.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the powerful UI library
- PostgreSQL community for the robust database
- All contributors and users of this project

## 📞 Support

For issues, questions, or contributions, please open an issue on the repository.

---

**Happy Coding! 🚀** 
