-- ============================================================
--  Conference Room Booking System — Seed Data
--  Run this AFTER conference_system.sql
-- ============================================================

USE conference_system;

-- ─────────────────────────────────────────
-- USERS
-- Passwords: plain 'password123' (store hashed in production)
-- userrole_id: 'admin' or 'user'
-- ─────────────────────────────────────────
INSERT IGNORE INTO users (uid, userrole_id, name, email, password, dept, phone_no) VALUES
('U-01', 'admin', 'Admin User',      'admin@company.com',  '$2b$10$PhvHFLxgJ4FwAeWxTjZPvO7r3HBpV7eXTNyqi89VcnfrWOxK0JMcW', 'IT',          '9000000001'),
('U-02', 'user',  'Alice Johnson',   'alice@company.com',  '$2b$10$PhvHFLxgJ4FwAeWxTjZPvO7r3HBpV7eXTNyqi89VcnfrWOxK0JMcW', 'Engineering', '9000000002'),
('U-03', 'user',  'Bob Smith',       'bob@company.com',    '$2b$10$PhvHFLxgJ4FwAeWxTjZPvO7r3HBpV7eXTNyqi89VcnfrWOxK0JMcW', 'Marketing',   '9000000003'),
('U-04', 'user',  'Carol Williams',  'carol@company.com',  '$2b$10$PhvHFLxgJ4FwAeWxTjZPvO7r3HBpV7eXTNyqi89VcnfrWOxK0JMcW', 'HR',          '9000000004'),
('U-05', 'user',  'David Brown',     'david@company.com',  '$2b$10$PhvHFLxgJ4FwAeWxTjZPvO7r3HBpV7eXTNyqi89VcnfrWOxK0JMcW', 'Finance',     '9000000005');

-- ─────────────────────────────────────────
-- CONFERENCE CATALOG (Rooms)
-- Composite PK: (catalog_id, room_id)
-- ─────────────────────────────────────────
INSERT IGNORE INTO conference_catalog (catalog_id, room_id, room_name, capacity, location, amenities, status, floor_no, room_number, availability) VALUES
('CAT-01', 'R-01', 'Executive Boardroom', 20, 'Block A',  'Projector, Video Conferencing, WiFi, AC, Telephone, TV Screen, Sound System', 'active', 5, 'A501', 'available'),
('CAT-01', 'R-02', 'Innovation Hub',       12, 'Block B',  'Whiteboard, WiFi, AC, TV Screen',                                           'active', 2, 'B201', 'available'),
('CAT-02', 'R-03', 'Meeting Room 1',        6, 'Block A',  'Whiteboard, WiFi, AC',                                                      'active', 1, 'A101', 'available'),
('CAT-02', 'R-04', 'Meeting Room 2',        6, 'Block A',  'Projector, Whiteboard, WiFi, AC',                                           'active', 1, 'A102', 'available'),
('CAT-03', 'R-05', 'Training Center',      40, 'Block C',  'Projector, WiFi, AC, Sound System, Wheelchair Access',                      'active', 3, 'C301', 'available'),
('CAT-03', 'R-06', 'Sky Lounge',           15, 'Block B',  'Video Conferencing, WiFi, AC, Coffee Machine',                              'active', 6, 'B601', 'available');

-- ─────────────────────────────────────────
-- BOOKINGS
-- ─────────────────────────────────────────
INSERT IGNORE INTO booking (booking_id, catalog_id, room_id, uid, start_date, end_date, start_time, end_time, purpose, status) VALUES
('B-01', 'CAT-01', 'R-01', 'U-02', '2026-02-20', '2026-02-20', '09:00:00', '11:00:00', 'Q1 Strategy Meeting',       'confirmed'),
('B-02', 'CAT-01', 'R-02', 'U-03', '2026-02-20', '2026-02-20', '13:00:00', '14:30:00', 'Marketing Campaign Review', 'confirmed'),
('B-03', 'CAT-02', 'R-03', 'U-04', '2026-02-21', '2026-02-21', '10:00:00', '11:00:00', 'HR Policy Discussion',      'confirmed'),
('B-04', 'CAT-02', 'R-04', 'U-05', '2026-02-21', '2026-02-21', '14:00:00', '16:00:00', 'Budget Planning',           'confirmed'),
('B-05', 'CAT-03', 'R-05', 'U-02', '2026-02-24', '2026-02-24', '09:00:00', '17:00:00', 'New Employee Training',     'confirmed'),
('B-06', 'CAT-03', 'R-06', 'U-03', '2026-02-25', '2026-02-25', '11:00:00', '12:30:00', 'Client Presentation',       'pending');

-- ─────────────────────────────────────────
-- CANCELLATIONS
-- ─────────────────────────────────────────
-- Example: B-04 cancelled by David Brown
INSERT IGNORE INTO cancellation (cancel_id, booking_id, cancel_reason, cancel_date, cancel_fromdate, cancel_todate, cancel_fromtime, cancel_totime, cancelled_by_uid) VALUES
('C-01', 'B-04', 'Schedule conflict with town hall meeting', '2026-02-20', '2026-02-21', '2026-02-21', '14:00:00', '16:00:00', 'U-05');
