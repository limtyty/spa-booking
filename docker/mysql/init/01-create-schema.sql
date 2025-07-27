-- Create database schema for spa booking system
CREATE DATABASE IF NOT EXISTS spa_booking;
USE spa_booking;

-- Treatments table
CREATE TABLE treatments (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Personnel table
CREATE TABLE personnel (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Personnel working hours table
CREATE TABLE personnel_working_hours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    personnel_id VARCHAR(36) NOT NULL,
    day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
    is_working BOOLEAN DEFAULT FALSE,
    start_time TIME,
    end_time TIME,
    FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE,
    UNIQUE KEY unique_personnel_day (personnel_id, day_of_week)
);

-- Rooms table
CREATE TABLE rooms (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    capacity INT NOT NULL DEFAULT 1,
    description TEXT,
    status ENUM('available', 'maintenance') DEFAULT 'available',
    maintenance_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
    id VARCHAR(36) PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    treatment_id VARCHAR(36) NOT NULL,
    room_id VARCHAR(36) NOT NULL,
    status ENUM('confirmed', 'cancelled', 'completed', 'no-show') DEFAULT 'confirmed',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (treatment_id) REFERENCES treatments(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    INDEX idx_booking_datetime (booking_date, booking_time),
    INDEX idx_client_email (client_email)
);

-- Booking personnel junction table
CREATE TABLE booking_personnel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id VARCHAR(36) NOT NULL,
    personnel_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE,
    UNIQUE KEY unique_booking_personnel (booking_id, personnel_id)
);

-- Personnel treatments junction table
CREATE TABLE personnel_treatments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    personnel_id VARCHAR(36) NOT NULL,
    treatment_id VARCHAR(36) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    skill_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'intermediate',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE,
    FOREIGN KEY (treatment_id) REFERENCES treatments(id) ON DELETE CASCADE,
    UNIQUE KEY unique_personnel_treatment (personnel_id, treatment_id),
    INDEX idx_personnel_id (personnel_id),
    INDEX idx_treatment_id (treatment_id)
);
