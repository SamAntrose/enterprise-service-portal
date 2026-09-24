-- ====================================================================
-- PostgreSQL DDL Database Schema Script
-- Database Name: enterprise_portal_db
-- ====================================================================

-- 1. Create Database (Run separately if executing in pgAdmin or psql)
-- CREATE DATABASE enterprise_portal_db;

-- 2. Drop Tables if they exist (Clean Setup)
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS csat_ratings CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS change_requests CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS kb_articles CASCADE;
DROP TABLE IF EXISTS ticket_comments CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 3. Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'EMPLOYEE',
    department VARCHAR(100),
    phone_number VARCHAR(50),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tickets Table
CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    ticket_code VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    requester_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    assigned_tech_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    asset_id VARCHAR(100),
    location VARCHAR(255),
    ai_sentiment VARCHAR(50),
    ai_urgency_score INT,
    ai_suggested_kb VARCHAR(255),
    is_major_incident BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Ticket Comments Table
CREATE TABLE ticket_comments (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    comment_text TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Knowledge Base Table
CREATE TABLE kb_articles (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    author_name VARCHAR(255),
    tags VARCHAR(255),
    view_count INT DEFAULT 0,
    helpful_count INT DEFAULT 0,
    deflected_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. ITAM Assets Table
CREATE TABLE assets (
    id BIGSERIAL PRIMARY KEY,
    asset_tag VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    assigned_user VARCHAR(255),
    location VARCHAR(255),
    purchase_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Change Requests (CAB) Table
CREATE TABLE change_requests (
    id BIGSERIAL PRIMARY KEY,
    change_code VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    risk_level VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Submitted',
    requested_by VARCHAR(255),
    approved_by VARCHAR(255),
    scheduled_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Security Audit Logs Table
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    user_role VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Customer Satisfaction Ratings Table
CREATE TABLE csat_ratings (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    ticket_code VARCHAR(100),
    rating INT NOT NULL,
    feedback TEXT,
    submitted_by VARCHAR(255),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Live Chat Messages Table
CREATE TABLE chat_messages (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    sender_role VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
