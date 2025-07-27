-- Seed data for spa booking system
USE spa_booking;

-- Insert sample treatments
INSERT INTO treatments (id, name, description, duration_minutes, price, is_active) VALUES
('t1', 'Swedish Massage', 'Relaxing full body massage with gentle pressure', 60, 120.00, TRUE),
('t2', 'Deep Tissue Massage', 'Therapeutic massage targeting muscle tension', 90, 150.00, TRUE),
('t3', 'Facial Treatment', 'Rejuvenating facial with cleansing and moisturizing', 75, 100.00, TRUE),
('t4', 'Hot Stone Massage', 'Massage using heated stones for deep relaxation', 90, 180.00, TRUE),
('t5', 'Aromatherapy Massage', 'Massage with essential oils for relaxation', 60, 130.00, TRUE),
('t6', 'Couples Massage', 'Relaxing massage experience for two people', 60, 220.00, TRUE),
('t7', 'Prenatal Massage', 'Gentle massage designed for expecting mothers', 60, 140.00, TRUE),
('t8', 'Sports Massage', 'Therapeutic massage for athletes and active individuals', 75, 160.00, TRUE);

-- Insert sample personnel
INSERT INTO personnel (id, name, role, email, phone, is_active) VALUES
('p1', 'Sarah Johnson', 'Massage Therapist', 'sarah@spa.com', '555-0101', TRUE),
('p2', 'Mike Chen', 'Massage Therapist', 'mike@spa.com', '555-0102', TRUE),
('p3', 'Emma Davis', 'Esthetician', 'emma@spa.com', '555-0103', TRUE),
('p4', 'David Wilson', 'Massage Therapist', 'david@spa.com', '555-0104', TRUE),
('p5', 'Lisa Rodriguez', 'Spa Manager', 'lisa@spa.com', '555-0105', TRUE),
('p6', 'James Thompson', 'Wellness Coach', 'james@spa.com', '555-0106', TRUE);

-- Insert sample rooms
INSERT INTO rooms (id, name, capacity, description, status) VALUES
('r1', 'Serenity Room', 1, 'Quiet room with soft lighting for massages', 'available'),
('r2', 'Harmony Suite', 1, 'Spacious room with mountain view', 'available'),
('r3', 'Tranquil Space', 1, 'Cozy room perfect for facial treatments', 'available'),
('r4', 'Zen Chamber', 1, 'Minimalist room with calming ambiance', 'available'),
('r5', 'Couples Retreat', 2, 'Large room designed for couples treatments', 'available'),
('r6', 'Wellness Studio', 4, 'Multi-purpose room for group sessions', 'available');

-- Insert personnel working hours
INSERT INTO personnel_working_hours (personnel_id, day_of_week, is_working, start_time, end_time) VALUES
-- Sarah Johnson (p1) - Monday to Friday, 9 AM to 6 PM
('p1', 'monday', TRUE, '09:00:00', '18:00:00'),
('p1', 'tuesday', TRUE, '09:00:00', '18:00:00'),
('p1', 'wednesday', TRUE, '09:00:00', '18:00:00'),
('p1', 'thursday', TRUE, '09:00:00', '18:00:00'),
('p1', 'friday', TRUE, '09:00:00', '18:00:00'),
('p1', 'saturday', FALSE, NULL, NULL),
('p1', 'sunday', FALSE, NULL, NULL),

-- Mike Chen (p2) - Tuesday to Saturday, 10 AM to 7 PM
('p2', 'monday', FALSE, NULL, NULL),
('p2', 'tuesday', TRUE, '10:00:00', '19:00:00'),
('p2', 'wednesday', TRUE, '10:00:00', '19:00:00'),
('p2', 'thursday', TRUE, '10:00:00', '19:00:00'),
('p2', 'friday', TRUE, '10:00:00', '19:00:00'),
('p2', 'saturday', TRUE, '10:00:00', '19:00:00'),
('p2', 'sunday', FALSE, NULL, NULL),

-- Emma Davis (p3) - Monday, Wednesday, Friday, Saturday
('p3', 'monday', TRUE, '09:00:00', '17:00:00'),
('p3', 'tuesday', FALSE, NULL, NULL),
('p3', 'wednesday', TRUE, '09:00:00', '17:00:00'),
('p3', 'thursday', FALSE, NULL, NULL),
('p3', 'friday', TRUE, '09:00:00', '17:00:00'),
('p3', 'saturday', TRUE, '10:00:00', '16:00:00'),
('p3', 'sunday', FALSE, NULL, NULL),

-- David Wilson (p4) - Monday to Thursday, 11 AM to 8 PM
('p4', 'monday', TRUE, '11:00:00', '20:00:00'),
('p4', 'tuesday', TRUE, '11:00:00', '20:00:00'),
('p4', 'wednesday', TRUE, '11:00:00', '20:00:00'),
('p4', 'thursday', TRUE, '11:00:00', '20:00:00'),
('p4', 'friday', FALSE, NULL, NULL),
('p4', 'saturday', FALSE, NULL, NULL),
('p4', 'sunday', FALSE, NULL, NULL),

-- Lisa Rodriguez (p5) - Monday to Friday, 8 AM to 5 PM
('p5', 'monday', TRUE, '08:00:00', '17:00:00'),
('p5', 'tuesday', TRUE, '08:00:00', '17:00:00'),
('p5', 'wednesday', TRUE, '08:00:00', '17:00:00'),
('p5', 'thursday', TRUE, '08:00:00', '17:00:00'),
('p5', 'friday', TRUE, '08:00:00', '17:00:00'),
('p5', 'saturday', FALSE, NULL, NULL),
('p5', 'sunday', FALSE, NULL, NULL),

-- James Thompson (p6) - Wednesday to Sunday, 12 PM to 8 PM
('p6', 'monday', FALSE, NULL, NULL),
('p6', 'tuesday', FALSE, NULL, NULL),
('p6', 'wednesday', TRUE, '12:00:00', '20:00:00'),
('p6', 'thursday', TRUE, '12:00:00', '20:00:00'),
('p6', 'friday', TRUE, '12:00:00', '20:00:00'),
('p6', 'saturday', TRUE, '12:00:00', '20:00:00'),
('p6', 'sunday', TRUE, '12:00:00', '20:00:00');

-- Insert personnel treatments relationships
INSERT INTO personnel_treatments (personnel_id, treatment_id, is_primary, skill_level) VALUES
('p1', 't1', TRUE, 'expert'),
('p1', 't2', FALSE, 'advanced'),
('p1', 't5', TRUE, 'expert'),
('p1', 't7', TRUE, 'expert'),
('p2', 't1', FALSE, 'advanced'),
('p2', 't2', TRUE, 'expert'),
('p2', 't4', TRUE, 'expert'),
('p2', 't8', TRUE, 'expert'),
('p3', 't3', TRUE, 'expert'),
('p4', 't1', FALSE, 'intermediate'),
('p4', 't4', FALSE, 'advanced'),
('p4', 't6', TRUE, 'expert'),
('p6', 't5', FALSE, 'intermediate'),
('p6', 't7', FALSE, 'beginner');

-- Insert sample bookings
INSERT INTO bookings (id, client_name, client_email, client_phone, booking_date, booking_time, treatment_id, room_id, status, notes) VALUES
('b1', 'Alice Smith', 'alice@email.com', '555-1001', '2024-02-15', '10:00:00', 't1', 'r1', 'confirmed', 'First time client'),
('b2', 'Bob Johnson', 'bob@email.com', '555-1002', '2024-02-15', '14:00:00', 't2', 'r2', 'confirmed', 'Regular client'),
('b3', 'Carol Brown', 'carol@email.com', '555-1003', '2024-02-16', '11:00:00', 't3', 'r3', 'confirmed', 'Sensitive skin'),
('b4', 'David Lee', 'david@email.com', '555-1004', '2024-02-16', '15:00:00', 't4', 'r4', 'confirmed', 'Prefers medium pressure'),
('b5', 'Emily White', 'emily@email.com', '555-1005', '2024-02-17', '09:00:00', 't5', 'r1', 'completed', 'Loved the lavender oil'),
('b6', 'Frank Miller', 'frank@email.com', '555-1006', '2024-02-17', '16:00:00', 't6', 'r5', 'confirmed', 'Anniversary celebration');

-- Insert booking personnel relationships
INSERT INTO booking_personnel (booking_id, personnel_id) VALUES
('b1', 'p1'),
('b2', 'p2'),
('b3', 'p3'),
('b4', 'p2'),
('b5', 'p1'),
('b6', 'p1'),
('b6', 'p4'); -- Couples massage requires two therapists
