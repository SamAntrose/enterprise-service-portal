-- ====================================================================
-- PostgreSQL Seed Data DML Script
-- ====================================================================

-- 1. Insert Initial Default System Users (Passwords are BCrypt hashed)
-- Password for all default accounts is: Admin@123 / Tech@123 / User@123
INSERT INTO users (email, password_hash, full_name, role, department, active) VALUES
('admin@enterprise.com', '$2a$10$e8wF5q1tXWz4mK8p0Q1yU.8O4G7v5V9z5H8E1J2K3L4M5N6O7P8Q', 'Enterprise Admin', 'ADMIN', 'IT Operations', TRUE),
('tech@enterprise.com', '$2a$10$e8wF5q1tXWz4mK8p0Q1yU.8O4G7v5V9z5H8E1J2K3L4M5N6O7P8Q', 'Alex Tech', 'TECHNICIAN', 'IT Service Desk', TRUE),
('employee@enterprise.com', '$2a$10$e8wF5q1tXWz4mK8p0Q1yU.8O4G7v5V9z5H8E1J2K3L4M5N6O7P8Q', 'Sarah Employee', 'EMPLOYEE', 'Finance', TRUE)
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Knowledge Base Articles
INSERT INTO kb_articles (title, content, category, author_name, tags, view_count, helpful_count, deflected_count) VALUES
('VPN Connection Troubleshooting Guide', 'Step 1: Open GlobalProtect VPN client. Step 2: Ensure portal address is vpn.enterprise.com. Step 3: Clear DNS cache via ipconfig /flushdns.', 'Network & Access', 'Alex Tech', 'vpn, network, remote, access', 142, 38, 12),
('Facilities: Adjusting Office Thermostat / HVAC', 'Zone HVAC controllers operate on 15-minute sync cycles. Set target temperature between 21°C and 24°C.', 'Facilities Management', 'Corporate Facilities Team', 'hvac, temperature, facilities, cooling', 95, 24, 7),
('Wi-Fi Network Setup (Enterprise-Secure)', 'Connect to Enterprise-Secure SSID. Enter domain credentials in PEAP MSCHAPv2 prompt. Accept certificate.', 'Network & Access', 'IT Helpdesk', 'wifi, network, wireless', 210, 52, 19);

-- 3. Insert ITAM Assets
INSERT INTO assets (asset_tag, name, category, serial_number, status, assigned_user, location, purchase_date) VALUES
('AST-MAC-9082', 'MacBook Pro 16" M3 Max', 'Laptop', 'C02G3098MD6M', 'Active', 'Sarah Employee', 'Floor 3 - Desk 304', '2025-03-15'),
('AST-SVR-0104', 'Dell PowerEdge R760 Database Server', 'Server', 'DP-9982-X7', 'Active', 'IT Infrastructure Team', 'Data Center Rack B4', '2024-11-01'),
('AST-HVAC-002', 'Trane Commercial HVAC Chiller Unit', 'HVAC Unit', 'TR-88392-HV', 'In Maintenance', 'Facilities Management', 'Roof Top Zone B', '2023-06-20')
ON CONFLICT (asset_tag) DO NOTHING;
