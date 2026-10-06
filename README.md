# 👤 User Management Full-Stack Application

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

A modern, full-stack User Management Web Application built with **Java 21**, **Spring Boot**, **Spring Data JPA / Hibernate**, and **MySQL**, featuring a responsive **HTML5/CSS3/JavaScript (AJAX)** frontend. The entire application is containerized with **Docker** and **Docker Compose** for seamless single-command deployment.

---

## 📌 Table of Contents
- [Architecture & Design Principles](#-architecture--design-principles)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [REST API Specifications](#-rest-api-specifications)
- [Quick Start with Docker](#-quick-start-with-docker)
- [Local Development Setup](#-local-development-setup)
- [Interactive API Docs (Swagger)](#-interactive-api-docs-swagger)

---

## 🏛 Architecture & Design Principles

The application strictly follows industry best practices and clean enterprise architecture:

* **Layered 3-Tier Architecture:**  
  Clean separation of concerns: `Controller` (HTTP/REST) $\rightarrow$ `Service` (Business Logic & Transactions) $\rightarrow$ `Repository` (Data Access).
* **DTO Pattern (Java 21 Records):**  
  Entities (`User`, `Address`) are completely decoupled from external API contracts. DTOs are implemented as immutable Java `record` types to prevent over-fetching, circular references (Jackson infinite recursion), and data leakage.
* **JPA Bidirectional Relationship & Cascading:**  
  Bidirectional `1-to-1` relationship between `User` and `Address` with `CascadeType.ALL` and `orphanRemoval = true`, ensuring automatic cleanup and data integrity at the database layer.
* **Declarative Transaction Management:**  
  `@Transactional(readOnly = true)` applied at the service class level disables Hibernate dirty checking for high-performance reads, while write operations (`createUser`, `deleteUser`) use `@Transactional` to guarantee atomicity and automatic rollback upon errors.
* **Centralized Exception Handling:**  
  Built with `@RestControllerAdvice` and `@ExceptionHandler`, transforming both domain errors (`ResourceNotFoundException`) and validation errors (`MethodArgumentNotValidException`) into consistent, structured JSON responses.
* **Explicit Schema Initialization & Hibernate Validation:**  
  The database schema, foreign keys, and cascade behaviors are explicitly defined in `schema.sql` (`spring.sql.init.mode=always`). Hibernate runs in `ddl-auto=validate` mode to strictly verify that JPA entity mappings align with the relational schema on startup, avoiding unintended auto-DDL mutations.
* **Modern Frontend Architecture:**  
  Lightweight Single Page Application (SPA) feel using asynchronous AJAX requests, dynamic DOM rendering, jQuery UI Datepicker, and **Event Delegation** to handle dynamically inserted elements.

---

## ✨ Key Features

- **User Registration:** Dynamic form with client-side and server-side validation (`@NotBlank`, `@Past`, `@Size`), featuring an interactive jQuery UI Datepicker with keyboard lock (`readonly`) for foolproof date selection.
- **User Directory & Details:**
  - Lightweight summary table view with smooth scrolling.
  - Dedicated user profile details view (`details.html?id=:id`) fetching full demographic and address records.
- **Cascaded Deletion:** Safe user deletion that automatically purges linked address records.
- **Interactive UI Feedback:** Real-time feedback for successes and validation error banners without page reloads.

---

## 🛠 Tech Stack

### Backend
- **Language:** Java 21 (LTS)
- **Framework:** Spring Boot (Web MVC, Data JPA, Validation)
- **ORM / Persistence:** Hibernate, Spring Data JPA
- **Database:** MySQL 8.0
- **Documentation:** SpringDoc OpenAPI 3 / Swagger UI
- **Boilerplate Reduction:** Project Lombok

### Frontend
- **Markup & Styling:** HTML5, CSS3 (Modern Flexbox, custom scrollable tables, responsive layouts)
- **Scripting & Widgets:** JavaScript (ES6+), jQuery 3.7, jQuery UI 1.14 (Datepicker), AJAX

### DevOps & Tooling
- **Build Tool:** Maven (Multi-stage Docker build)
- **Containerization:** Docker & Docker Compose

---

## 📂 Project Structure

```text
.
├── Dockerfile                         # Multi-stage build (Maven builder -> JRE runtime)
├── docker-compose.yaml                # Multi-container orchestration (MySQL + App)
├── pom.xml                            # Maven dependencies & build configuration
└── src/
    └── main/
        ├── java/com/app/user_management_app/
        │   ├── controller/            # REST API endpoints (UserController)
        │   ├── dto/                   # Immutable record DTOs (Requests & Responses)
        │   ├── entity/                # JPA entities (User, Address, Gender enum)
        │   ├── exception/             # GlobalExceptionHandler & Custom Exceptions
        │   ├── repository/            # Spring Data JPA repositories (UserRepository)
        │   └── service/               # Business logic & Transaction management
        └── resources/
            ├── application.properties # Application and database configurations
            ├── schema.sql             # Relational DDL definitions & table initialization
            └── static/                # Frontend assets
                ├── css/styles.css     # Responsive styles & layout
                ├── js/                # Client logic (app.js, details.js)
                ├── index.html         # Main dashboard (registration & directory)
                └── details.html       # Individual user details view
```

---

## 📡 REST API Specifications

### Endpoints

| HTTP Method | Endpoint | Description | Response Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | Retrieve lightweight summaries of all users | `200 OK` |
| `GET` | `/api/users/{id}` | Retrieve detailed user profile including addresses | `200 OK` / `404 Not Found` |
| `POST` | `/api/users` | Register a new user and linked address | `201 Created` / `400 Bad Request` |
| `DELETE` | `/api/users/{id}` | Delete user and cascade delete address | `204 No Content` / `404 Not Found` |

### Sample Payloads

#### `POST /api/users` (Request Body)
```json
{
  "name": "Jane",
  "surname": "Doe",
  "gender": "FEMALE",
  "birthdate": "1995-05-15",
  "homeAddress": "42 Maple Street, Springfield",
  "workAddress": "100 Tech Park, Springfield"
}
```

#### `GET /api/users/{id}` (Response Body)
```json
{
  "id": 1,
  "name": "Jane",
  "surname": "Doe",
  "gender": "FEMALE",
  "birthdate": "1995-05-15",
  "homeAddress": "42 Maple Street, Springfield",
  "workAddress": "100 Tech Park, Springfield"
}
```

---

## 🚀 Quick Start with Docker

The fastest way to run the entire application (Backend, Frontend, and MySQL database) is via Docker Compose:

### 1. Clone the repository
```bash
git clone <repository-url>
cd "Simple Web Java Application"
```

### 2. Launch with Docker Compose
```bash
docker compose up --build -d
```

### 3. Access the Application
- **Web Application:** [http://localhost:8090](http://localhost:8090)
- **Swagger UI:** [http://localhost:8090/swagger-ui/index.html](http://localhost:8090/swagger-ui/index.html)

### 4. Stop the Application
```bash
docker compose down
```
*(To also remove the database volume, append `-v`: `docker compose down -v`)*

---

## 💻 Local Development Setup

If you prefer to run the application locally without Docker:

### Prerequisites
- **JDK 21** installed
- **Maven** (or use the included `./mvnw` wrapper)
- **MySQL 8.0** running locally on port `3306`

### 1. Configure Database Connection
Ensure MySQL has a database named `user_db` or allow auto-creation. You can update credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/user_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=admin
```

### 2. Build and Run
```bash
# Build the project
./mvnw clean package

# Run Spring Boot app
./mvnw spring-boot:run
```

The application will start on `http://localhost:8090`.

---

## 📖 Interactive API Docs (Swagger)

When the application is running, full interactive OpenAPI / Swagger documentation is available at:
```text
http://localhost:8090/swagger-ui/index.html
```
You can inspect request schemas, try out API calls, and view validation constraints directly from the browser.