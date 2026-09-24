# 🚀 Enterprise Service Portal (Spring Boot 3 + PostgreSQL)

An enterprise-grade **AI-Powered IT & Corporate Facilities Service Portal** built with **Spring Boot 3**, **Spring Data JPA**, **Spring Security 6**, **PostgreSQL**, **REST APIs**, and a responsive modern web dashboard.

---

## 🛠️ Project Structure

```text
enterprise_service_portal/
├── pom.xml                                   # Spring Boot 3 Maven Build File
├── .project / .classpath                     # Eclipse IDE Project Metadata
├── Database_Setup_Guide.md                   # PostgreSQL & H2 Setup Manual
├── src/main/resources/
│   ├── application.yml                       # Spring Boot & Database Profiles
│   └── db/
│       ├── schema-postgresql.sql             # PostgreSQL DDL Table Creation
│       └── data-postgresql.sql               # PostgreSQL Seed Data Script
└── src/main/java/com/enterprise/portal/
    ├── EnterprisePortalApplication.java      # Main Executable Application Class
    ├── config/DataInitializer.java           # Startup Data Seeder
    ├── controller/                           # REST API Controllers (@RestController)
    │   ├── AuthController.java               # POST /api/auth/login & /register
    │   ├── TicketController.java             # GET/POST /api/tickets, /comments, /chat, /csat
    │   ├── KbArticleController.java          # GET/POST /api/kb & /deflection
    │   ├── AssetController.java              # GET/POST /api/assets (ITAM)
    │   ├── ChangeRequestController.java     # GET/POST/PUT /api/changes (CAB)
    │   └── AuditLogController.java           # GET /api/audit-logs
    ├── dto/                                  # Data Transfer Objects
    ├── model/                                # JPA Entity Classes (@Entity)
    │   ├── User.java, Ticket.java, KbArticle.java, Asset.java, ChangeRequest.java, ...
    ├── repository/                           # Spring Data JPA Repositories
    ├── security/                             # JWT Token Provider & Spring Security 6 Config
    └── service/                              # Business Logic Services (@Service)
```

---

## 💻 How to Run in Eclipse IDE

1. **Open Eclipse IDE**.
2. Click **File -> Import... -> Maven -> Existing Maven Projects**.
3. Browse to this directory:
   `C:\Users\acer\.gemini\antigravity\scratch\enterprise_service_portal`
4. Click **Finish**.
5. In Project Explorer, open:
   `src/main/java` -> `com.enterprise.portal` -> **`EnterprisePortalApplication.java`**.
6. Right-click **`EnterprisePortalApplication.java`** -> **Run As -> Java Application**.

---

## 🌐 URLs & Testing

- **Web Portal Dashboard**: `http://localhost:8080`
- **H2 Database Console**: `http://localhost:8080/h2-console`
- **Default Accounts**:
  - Admin: `admin@enterprise.com` (Password: `Admin@123`)
  - Technician: `tech@enterprise.com` (Password: `Tech@123`)
  - Employee: `employee@enterprise.com` (Password: `User@123`)
