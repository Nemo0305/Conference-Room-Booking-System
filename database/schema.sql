-- ============================================================
--  Conference Room Booking System — Database Schema
--  Database: MySQL / PostgreSQL compatible
--  Created: 2026-02-19
-- ============================================================

-- ─────────────────────────────────────────
-- DROP TABLES (safe re-run order)
-- ─────────────────────────────────────────
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS booking_attendees;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS room_amenities;
DROP TABLE IF EXISTS amenities;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- ─────────────────────────────────────────
-- 1. ROLES
-- ─────────────────────────────────────────
CREATE TABLE roles (
    role_id     INT             PRIMARY KEY AUTO_INCREMENT,
    role_name   VARCHAR(50)     NOT NULL UNIQUE,   -- e.g. 'admin', 'user'
    created_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────
-- 2. USERS
-- ─────────────────────────────────────────
CREATE TABLE users (
    user_id         INT             PRIMARY KEY AUTO_INCREMENT,
    role_id         INT             NOT NULL DEFAULT 2,       -- 2 = regular user
    full_name       VARCHAR(100)    NOT NULL,
    email           VARCHAR(150)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    phone           VARCHAR(20),
    department      VARCHAR(100),
    avatar_url      VARCHAR(255),
    is_active       BOOLEAN         DEFAULT TRUE,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- ─────────────────────────────────────────
-- 3. ROOMS
-- ─────────────────────────────────────────
CREATE TABLE rooms (
    room_id         INT             PRIMARY KEY AUTO_INCREMENT,
    room_name       VARCHAR(100)    NOT NULL,
    location        VARCHAR(150)    NOT NULL,          -- e.g. 'Floor 3, Block A'
    floor           VARCHAR(20),
    capacity        INT             NOT NULL,           -- max number of people
    room_type       ENUM('conference', 'meeting', 'boardroom', 'training') DEFAULT 'conference',
    description     TEXT,
    image_url       VARCHAR(255),
    is_available    BOOLEAN         DEFAULT TRUE,
    price_per_hour  DECIMAL(8, 2)   DEFAULT 0.00,      -- 0 if free
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────
-- 4. AMENITIES
-- ─────────────────────────────────────────
CREATE TABLE amenities (
    amenity_id      INT             PRIMARY KEY AUTO_INCREMENT,
    amenity_name    VARCHAR(100)    NOT NULL UNIQUE,   -- e.g. 'Projector', 'Whiteboard'
    icon            VARCHAR(50)                        -- icon name/class
);

-- ─────────────────────────────────────────
-- 5. ROOM AMENITIES (Many-to-Many)
-- ─────────────────────────────────────────
CREATE TABLE room_amenities (
    room_id         INT NOT NULL,
    amenity_id      INT NOT NULL,
    PRIMARY KEY (room_id, amenity_id),
    FOREIGN KEY (room_id)    REFERENCES rooms(room_id)    ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(amenity_id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────
-- 6. BOOKINGS
-- ─────────────────────────────────────────
CREATE TABLE bookings (
    booking_id      INT             PRIMARY KEY AUTO_INCREMENT,
    user_id         INT             NOT NULL,
    room_id         INT             NOT NULL,
    title           VARCHAR(200)    NOT NULL,           -- meeting title
    description     TEXT,
    booking_date    DATE            NOT NULL,
    start_time      TIME            NOT NULL,
    end_time        TIME            NOT NULL,
    attendees_count INT             DEFAULT 1,
    status          ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'confirmed',
    is_recurring    BOOLEAN         DEFAULT FALSE,
    recurring_type  ENUM('daily', 'weekly', 'monthly') NULL,
    total_cost      DECIMAL(8, 2)   DEFAULT 0.00,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE,

    -- Prevent double bookings for the same room/time
    CONSTRAINT no_overlap CHECK (start_time < end_time)
);

-- ─────────────────────────────────────────
-- 7. BOOKING ATTENDEES
-- ─────────────────────────────────────────
CREATE TABLE booking_attendees (
    id              INT             PRIMARY KEY AUTO_INCREMENT,
    booking_id      INT             NOT NULL,
    user_id         INT             NOT NULL,

    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)    REFERENCES users(user_id)       ON DELETE CASCADE,
    UNIQUE (booking_id, user_id)
);

-- ─────────────────────────────────────────
-- 8. NOTIFICATIONS
-- ─────────────────────────────────────────
CREATE TABLE notifications (
    notification_id INT             PRIMARY KEY AUTO_INCREMENT,
    user_id         INT             NOT NULL,
    booking_id      INT,
    message         TEXT            NOT NULL,
    type            ENUM('booking_confirmed', 'booking_cancelled', 'reminder', 'general') DEFAULT 'general',
    is_read         BOOLEAN         DEFAULT FALSE,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)   REFERENCES users(user_id)       ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE SET NULL
);

-- ─────────────────────────────────────────
-- INDEXES for performance
-- ─────────────────────────────────────────
CREATE INDEX idx_bookings_room_date    ON bookings(room_id, booking_date);
CREATE INDEX idx_bookings_user         ON bookings(user_id);
CREATE INDEX idx_bookings_status       ON bookings(status);
CREATE INDEX idx_notifications_user    ON notifications(user_id, is_read);
