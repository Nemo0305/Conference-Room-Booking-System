-- ============================================================
--  Conference Room Booking System — Seed Data
--  Run this AFTER schema.sql
-- ============================================================

-- ─────────────────────────────────────────
-- ROLES
-- ─────────────────────────────────────────
INSERT INTO roles (role_id, role_name) VALUES
(1, 'admin'),
(2, 'user');

-- ─────────────────────────────────────────
-- USERS (passwords are hashed — plain: 'password123')
-- ─────────────────────────────────────────
INSERT INTO users (role_id, full_name, email, password_hash, phone, department) VALUES
(1, 'Admin User',      'admin@company.com',   '$2b$10$hashedpassword1', '9000000001', 'IT'),
(2, 'Alice Johnson',   'alice@company.com',   '$2b$10$hashedpassword2', '9000000002', 'Engineering'),
(2, 'Bob Smith',       'bob@company.com',     '$2b$10$hashedpassword3', '9000000003', 'Marketing'),
(2, 'Carol Williams',  'carol@company.com',   '$2b$10$hashedpassword4', '9000000004', 'HR'),
(2, 'David Brown',     'david@company.com',   '$2b$10$hashedpassword5', '9000000005', 'Finance');

-- ─────────────────────────────────────────
-- AMENITIES
-- ─────────────────────────────────────────
INSERT INTO amenities (amenity_name, icon) VALUES
('Projector',           'projector'),
('Whiteboard',          'whiteboard'),
('Video Conferencing',  'video'),
('WiFi',                'wifi'),
('Air Conditioning',    'ac'),
('Telephone',           'phone'),
('TV Screen',           'tv'),
('Sound System',        'speaker'),
('Coffee Machine',      'coffee'),
('Wheelchair Access',   'accessibility');

-- ─────────────────────────────────────────
-- ROOMS
-- ─────────────────────────────────────────
INSERT INTO rooms (room_name, location, floor, capacity, room_type, description, is_available, price_per_hour) VALUES
('Executive Boardroom', 'Block A, Floor 5', 'Floor 5',  20, 'boardroom',   'Premium boardroom with city view, full AV setup.',       TRUE,  0.00),
('Innovation Hub',      'Block B, Floor 2', 'Floor 2',  12, 'conference',  'Creative space with whiteboards and brainstorming tools.', TRUE,  0.00),
('Meeting Room 1',      'Block A, Floor 1', 'Floor 1',   6, 'meeting',     'Small meeting room ideal for quick syncs.',               TRUE,  0.00),
('Meeting Room 2',      'Block A, Floor 1', 'Floor 1',   6, 'meeting',     'Small meeting room with projector.',                      TRUE,  0.00),
('Training Center',     'Block C, Floor 3', 'Floor 3',  40, 'training',    'Large training room with projector and sound system.',    TRUE,  0.00),
('Sky Lounge',          'Block B, Floor 6', 'Floor 6',  15, 'conference',  'Rooftop conference room with panoramic views.',           TRUE,  0.00);

-- ─────────────────────────────────────────
-- ROOM AMENITIES
-- ─────────────────────────────────────────
-- Executive Boardroom: Projector, Video Conferencing, WiFi, AC, Telephone, TV Screen, Sound System
INSERT INTO room_amenities (room_id, amenity_id) VALUES
(1, 1), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8);

-- Innovation Hub: Whiteboard, WiFi, AC, TV Screen
INSERT INTO room_amenities (room_id, amenity_id) VALUES
(2, 2), (2, 4), (2, 5), (2, 7);

-- Meeting Room 1: Whiteboard, WiFi, AC
INSERT INTO room_amenities (room_id, amenity_id) VALUES
(3, 2), (3, 4), (3, 5);

-- Meeting Room 2: Projector, Whiteboard, WiFi, AC
INSERT INTO room_amenities (room_id, amenity_id) VALUES
(4, 1), (4, 2), (4, 4), (4, 5);

-- Training Center: Projector, WiFi, AC, Sound System, Wheelchair Access
INSERT INTO room_amenities (room_id, amenity_id) VALUES
(5, 1), (5, 4), (5, 5), (5, 8), (5, 10);

-- Sky Lounge: Video Conferencing, WiFi, AC, Coffee Machine
INSERT INTO room_amenities (room_id, amenity_id) VALUES
(6, 3), (6, 4), (6, 5), (6, 9);

-- ─────────────────────────────────────────
-- BOOKINGS
-- ─────────────────────────────────────────
INSERT INTO bookings (user_id, room_id, title, booking_date, start_time, end_time, attendees_count, status) VALUES
(2, 1, 'Q1 Strategy Meeting',       '2026-02-20', '09:00:00', '11:00:00', 10, 'confirmed'),
(3, 2, 'Marketing Campaign Review', '2026-02-20', '13:00:00', '14:30:00',  6, 'confirmed'),
(4, 3, 'HR Policy Discussion',      '2026-02-21', '10:00:00', '11:00:00',  4, 'confirmed'),
(5, 4, 'Budget Planning',           '2026-02-21', '14:00:00', '16:00:00',  5, 'confirmed'),
(2, 5, 'New Employee Training',     '2026-02-24', '09:00:00', '17:00:00', 30, 'confirmed'),
(3, 6, 'Client Presentation',       '2026-02-25', '11:00:00', '12:30:00',  8, 'pending');

-- ─────────────────────────────────────────
-- NOTIFICATIONS
-- ─────────────────────────────────────────
INSERT INTO notifications (user_id, booking_id, message, type) VALUES
(2, 1, 'Your booking for "Q1 Strategy Meeting" on Feb 20 has been confirmed.',            'booking_confirmed'),
(3, 2, 'Your booking for "Marketing Campaign Review" on Feb 20 has been confirmed.',      'booking_confirmed'),
(4, 3, 'Your booking for "HR Policy Discussion" on Feb 21 has been confirmed.',           'booking_confirmed'),
(5, 4, 'Your booking for "Budget Planning" on Feb 21 has been confirmed.',                'booking_confirmed'),
(2, 5, 'Reminder: "New Employee Training" is scheduled for Feb 24 at 9:00 AM.',          'reminder'),
(3, 6, 'Your booking for "Client Presentation" is pending approval.',                    'general');
