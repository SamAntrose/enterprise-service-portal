# 🗄️ PostgreSQL & Database Setup Guide

This guide explains how database management works in the **Enterprise IT & Corporate Facilities Service Portal**, supporting both **PostgreSQL** (for production / live database) and **H2** (for instant zero-config local development).

---

## ⚡ Option 1: Automatic H2 In-Memory Database (Zero-Config / Default)

By default, the application runs using the **H2 profile** (`spring.profiles.active: h2`).

### Benefits:
- **No installation needed**: You do NOT need PostgreSQL installed on your computer to run the project in Eclipse.
- **Auto-seeded Data**: Automatically creates tables and seeds demo users, KB articles, and ITAM assets on startup.
- **Live Visual Inspection**: Open `http://localhost:8080/h2-console` in your browser.
  - **JDBC URL**: `jdbc:h2:mem:portaldb`
  - **User**: `sa`
  - **Password**: *(leave blank)*

---

## 🐘 Option 2: Connecting to PostgreSQL Database

If you have **PostgreSQL** installed on your computer (or pgAdmin), follow these steps to connect the portal to PostgreSQL:

### Step 1: Create the Database in PostgreSQL / pgAdmin
Open **pgAdmin** or `psql` shell and execute:
```sql
CREATE DATABASE enterprise_portal_db;
```

### Step 2: Run the Provided DDL & Seed Scripts
In pgAdmin or psql, run the provided SQL files located in your project directory:
1. `src/main/resources/db/schema-postgresql.sql` (Creates all 9 tables & constraints)
2. `src/main/resources/db/data-postgresql.sql` (Inserts initial seed records)

### Step 3: Switch Profile in `application.yml`
Open `src/main/resources/application.yml` and change line 11:
```yaml
spring:
  profiles:
    active: postgresql
```

### Step 4: Configure PostgreSQL Credentials (If non-default)
In `application.yml` under `# PostgreSQL Configuration`:
```yaml
  datasource:
    url: jdbc:postgresql://localhost:5432/enterprise_portal_db
    username: postgres   # Change to your PostgreSQL username if different
    password: postgres   # Change to your PostgreSQL password
```

---

## 📊 Database Schema Summary

| Table Name | Description | Key Attributes |
|---|---|---|
| `users` | User Accounts & Roles | `id`, `email`, `password_hash`, `role` (ADMIN, TECHNICIAN, EMPLOYEE), `department` |
| `tickets` | Incident & Service Requests | `ticket_code`, `title`, `category`, `priority`, `status`, `requester_id`, `assigned_tech_id` |
| `ticket_comments` | Activity Comments | `ticket_id`, `author_name`, `comment_text`, `is_internal`, `created_at` |
| `kb_articles` | Self-Service KB Articles | `title`, `content`, `category`, `view_count`, `deflected_count` |
| `assets` | ITAM Hardware/Software | `asset_tag`, `name`, `category`, `serial_number`, `status`, `assigned_user` |
| `change_requests` | CAB Change Advisory | `change_code`, `title`, `risk_level`, `status`, `approved_by` |
| `audit_logs` | Security Audit Trail | `username`, `user_role`, `action`, `details`, `timestamp` |
| `csat_ratings` | Customer Feedback | `ticket_id`, `rating` (1-5 stars), `feedback`, `submitted_by` |
| `chat_messages` | Live In-Ticket Chat | `ticket_id`, `sender_name`, `sender_role`, `message`, `timestamp` |
