-- ====================================================================
-- Enterprise IT & Corporate Facilities Portal Database Schema (PostgreSQL)
-- Week 2 Schema Definition
-- ====================================================================

-- Drop existing tables if re-initializing
DROP TABLE IF EXISTS ticket_comments CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS otp_codes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 1. Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Vendors Table
CREATE TABLE vendors (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    specialization VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Users Table (Role-Based Access Control)
-- Roles: 'EMPLOYEE', 'TECHNICIAN', 'VENDOR', 'ADMIN'
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('EMPLOYEE', 'TECHNICIAN', 'VENDOR', 'ADMIN')),
    vendor_company_id INT REFERENCES vendors(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. OTP Codes Table (Two-Factor Authentication / 2FA)
CREATE TABLE otp_codes (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(100) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tickets Table (Lifecycle Management)
-- Priorities: 'P1_CRITICAL', 'P2_HIGH', 'P3_MEDIUM', 'P4_LOW'
-- Statuses: 'SUBMITTED', 'AI_ANALYZED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    ticket_code VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'P3_MEDIUM' CHECK (priority IN ('P1_CRITICAL', 'P2_HIGH', 'P3_MEDIUM', 'P4_LOW')),
    status VARCHAR(20) NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'AI_ANALYZED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    location VARCHAR(100),
    created_by_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_vendor_id INT REFERENCES vendors(id) ON DELETE SET NULL,
    assigned_technician_id INT REFERENCES users(id) ON DELETE SET NULL,
    ai_confidence_score NUMERIC(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Ticket Comments & Audit Log Table
CREATE TABLE ticket_comments (
    id SERIAL PRIMARY KEY,
    ticket_id INT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- SEED DATA (Default System Categories, Vendors, and Demo Accounts)
-- ====================================================================

-- Insert Categories
INSERT INTO categories (name, description) VALUES
('Hardware', 'Physical devices, laptops, desktops, monitors, power supplies'),
('Software / Access', 'Application bugs, software licenses, password reset, VPN access'),
('Network / Connectivity', 'WiFi connectivity, router issues, IP configuration, internet outages'),
('Facilities / HVAC', 'Air conditioning, electrical plumbing, office maintenance, hazardous leaks'),
('Security / Access Control', 'Badge access, server room security, suspicious phishing alerts');

-- Insert Sample Vendors
INSERT INTO vendors (company_name, contact_email, phone, specialization) VALUES
('Dell Enterprise Solutions', 'support@dell-enterprise.com', '+1-800-555-0199', 'Hardware Repair & Laptop Replacement'),
('ChillTech Commercial Refrigeration', 'dispatch@chilltech-hvac.com', '+1-800-555-0188', 'Facilities HVAC & Server Room Cooling'),
('Cisco Network Services', 'noc@cisco-services.com', '+1-800-555-0177', 'Network Infrastructure & Router Outages');

-- Insert Initial Admin Account (Password: AdminPass123! hashed with BCrypt)
INSERT INTO users (full_name, email, password_hash, role) VALUES
('System Administrator', 'admin@company.com', '$2a$10$wE99Y5N.xYwzD.Qf5bK7s.GzQxY5N.xYwzD.Qf5bK7s.GzQxY5N', 'ADMIN'),
('Alice Smith (Employee)', 'alice@company.com', '$2a$10$wE99Y5N.xYwzD.Qf5bK7s.GzQxY5N.xYwzD.Qf5bK7s.GzQxY5N', 'EMPLOYEE'),
('Bob Technician (IT Lead)', 'bob@company.com', '$2a$10$wE99Y5N.xYwzD.Qf5bK7s.GzQxY5N.xYwzD.Qf5bK7s.GzQxY5N', 'TECHNICIAN');
