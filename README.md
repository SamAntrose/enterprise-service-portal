# 🚀 Enterprise Service Portal

An enterprise-grade **AI-Powered IT & Corporate Facilities Service Portal** built with **Spring Boot 3**, **Spring Data JPA**, **Spring Security 6**, **JWT Authentication**, **H2/PostgreSQL**, and a responsive modern web dashboard.

---

## 📋 Prerequisites

Before running, make sure you have installed:

| Tool | Version | Download |
|------|---------|----------|
| **Java JDK** | 17 or higher | [Download](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) |
| **Apache Maven** | 3.8+ | [Download](https://maven.apache.org/download.cgi) |
| **Git** | Any | [Download](https://git-scm.com/downloads) |

> **Note:** PostgreSQL is optional. The app runs with **H2 in-memory database** by default (zero config needed).

---

## 🚀 How to Run from GitHub

### Step 1: Clone the Repository

```bash
git clone https://github.com/SamAntrose/enterprise-service-portal.git
```

### Step 2: Navigate into the Project

```bash
cd enterprise-service-portal
```

### Step 3: Build the Project

```bash
mvn clean install -DskipTests
```

### Step 4: Run the Application

```bash
mvn spring-boot:run
```

### Step 5: Open in Browser

```
http://localhost:8081
```

That's it! The app will start with **H2 in-memory database** — no database installation needed! 🎉

---

## 🔑 Default Login Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@enterprise.com` | `Admin@123` |
| **Technician** | `tech@enterprise.com` | `Tech@123` |
| **Employee** | `employee@enterprise.com` | `User@123` |

---

## 💻 How to Run in Eclipse IDE

1. **Open Eclipse IDE**.
2. Click **File → Import... → Maven → Existing Maven Projects**.
3. Browse to the cloned `enterprise-service-portal` folder.
4. Click **Finish** and wait for Maven to download dependencies.
5. In Project Explorer, open:
   `src/main/java` → `com.enterprise.portal` → **`EnterprisePortalApplication.java`**.
6. Right-click **`EnterprisePortalApplication.java`** → **Run As → Java Application**.
7. Open browser: `http://localhost:8081`

---

## 🗄️ Database Configuration

### H2 (Default - No Setup Required)

The app uses **H2 in-memory database** by default. Access the H2 console at:
- **URL:** `http://localhost:8081/h2-console`
- **JDBC URL:** `jdbc:h2:mem:portaldb`
- **Username:** `sa`
- **Password:** *(leave empty)*

### PostgreSQL (Optional - For Production)

1. Install PostgreSQL and create a database:
   ```sql
   CREATE DATABASE enterprise_portal_db;
   ```

2. Update `src/main/resources/application.yml`:
   - Change `spring.profiles.active` from `h2` to `postgresql`
   - Or set environment variables:
     ```bash
     set DB_HOST=localhost
     set DB_PORT=5432
     set DB_NAME=enterprise_portal_db
     set DB_USER=postgres
     set DB_PASS=your_password
     ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

---

## 🌐 API Endpoints

| Module | Endpoint | Method |
|--------|----------|--------|
| **Auth** | `/api/auth/login` | POST |
| **Auth** | `/api/auth/register` | POST |
| **Tickets** | `/api/tickets` | GET, POST |
| **Knowledge Base** | `/api/kb` | GET, POST |
| **Assets (ITAM)** | `/api/assets` | GET, POST |
| **Change Requests** | `/api/changes` | GET, POST, PUT |
| **Audit Logs** | `/api/audit-logs` | GET |

---

## 🛠️ Project Structure

```text
enterprise-service-portal/
├── pom.xml                                    # Maven Build File
├── src/main/resources/
│   ├── application.yml                        # App Config & DB Profiles
│   └── db/
│       ├── schema-postgresql.sql              # PostgreSQL DDL
│       └── data-postgresql.sql                # PostgreSQL Seed Data
├── src/main/java/com/enterprise/portal/
│   ├── EnterprisePortalApplication.java       # Main Application Class
│   ├── config/DataInitializer.java            # Startup Data Seeder
│   ├── controller/                            # REST API Controllers
│   ├── dto/                                   # Data Transfer Objects
│   ├── model/                                 # JPA Entity Classes
│   ├── repository/                            # Spring Data JPA Repositories
│   ├── security/                              # JWT & Spring Security Config
│   └── service/                               # Business Logic Services
├── src/main/webapp/
│   ├── index.html                             # Frontend Dashboard
│   ├── css/styles.css                         # Stylesheet
│   └── js/app.js                              # Frontend JavaScript
└── ai_service/                                # Python AI Triage Microservice
    ├── main.py
    └── requirements.txt
```

---

## 📜 Tech Stack

- **Backend:** Java 17, Spring Boot 3.2.3, Spring Data JPA, Spring Security 6
- **Authentication:** JWT (JSON Web Tokens) + BCrypt Password Hashing
- **Database:** H2 (Dev) / PostgreSQL (Production)
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **AI Service:** Python FastAPI (Optional Microservice)
- **Build Tool:** Apache Maven

---

## 📄 License

This project is open source and available for educational purposes.
