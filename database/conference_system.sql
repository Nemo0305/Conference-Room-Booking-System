-- ==========================
-- CREATE DATABASE
-- ==========================
CREATE DATABASE IF NOT EXISTS conference_system;
USE conference_system;

-- ==========================
-- USERS TABLE
-- ==========================
CREATE TABLE IF NOT EXISTS users (
    uid VARCHAR(50) PRIMARY KEY,            -- alphanumeric allowed 

    userrole_id VARCHAR(50) NOT NULL,       
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    dept VARCHAR(100) NOT NULL,
    phone_no VARCHAR(20) UNIQUE NOT NULL
);

-- ==========================
-- CONFERENCE CATALOG TABLE
-- (Composite Primary Key)
-- ==========================
CREATE TABLE IF NOT EXISTS conference_catalog (
    catalog_id VARCHAR(50) NOT NULL,        -- alphanumeric
    room_id VARCHAR(50) NOT NULL,           -- alphanumeric

    room_name VARCHAR(100),
    capacity INT,
    location VARCHAR(200),
    amenities TEXT,
    status VARCHAR(50),
    floor_no INT,
    room_number VARCHAR(50),
    availability VARCHAR(50),

    PRIMARY KEY (catalog_id, room_id)
);

-- ==========================
-- BOOKING TABLE
-- ==========================
CREATE TABLE IF NOT EXISTS booking (
    booking_id VARCHAR(50) PRIMARY KEY,     -- alphanumeric 

    catalog_id VARCHAR(50) NOT NULL,
    room_id VARCHAR(50) NOT NULL,

    uid VARCHAR(50) NOT NULL,               -- references users.uid

    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    start_time TIME NOT NULL,
    end_time TIME NOT NULL,

    purpose VARCHAR(200),
    attendees INT DEFAULT 1,
    status VARCHAR(50),

    FOREIGN KEY (catalog_id, room_id)
        REFERENCES conference_catalog(catalog_id, room_id),

    FOREIGN KEY (uid)
        REFERENCES users(uid)
);

-- ==========================
-- CANCELLATION TABLE
-- ==========================
CREATE TABLE IF NOT EXISTS cancellation (
    cancel_id VARCHAR(50) PRIMARY KEY,      -- alphanumeric cancel ID

    booking_id VARCHAR(50) UNIQUE NOT NULL, -- 1:1 cancellation
    cancel_reason TEXT,
    cancel_date DATE NOT NULL,

    cancel_fromdate DATE,
    cancel_todate DATE,
    cancel_fromtime TIME,
    cancel_totime TIME,

    cancelled_by_uid VARCHAR(50) NOT NULL,

    FOREIGN KEY (booking_id)
        REFERENCES booking(booking_id),

    FOREIGN KEY (cancelled_by_uid)
        REFERENCES users(uid)
);

-- ==========================
-- TICKET_DETAILS TABLE
-- ==========================
CREATE TABLE IF NOT EXISTS ticket_details (
    ticket_id VARCHAR(50) PRIMARY KEY,
    booking_id VARCHAR(50) UNIQUE NOT NULL,
    uid VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id)
        REFERENCES booking(booking_id),

    FOREIGN KEY (uid)
        REFERENCES users(uid)
);