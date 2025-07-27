-- Update personnel working hours with more realistic schedules
USE spa_booking;

-- Clear existing working hours
DELETE FROM personnel_working_hours;

-- Add working hours for all personnel
-- Sarah Johnson (p1) - Monday to Friday, 9 AM to 6 PM
INSERT INTO personnel_working_hours (personnel_id, day_of_week, is_working, start_time, end_time) VALUES
('p1', 'monday', TRUE, '09:00:00', '18:00:00'),
('p1', 'tuesday', TRUE, '09:00:00', '18:00:00'),
('p1', 'wednesday', TRUE, '09:00:00', '18:00:00'),
('p1', 'thursday', TRUE, '09:00:00', '18:00:00'),
('p1', 'friday', TRUE, '09:00:00', '18:00:00'),
('p1', 'saturday', FALSE, NULL, NULL),
('p1', 'sunday', FALSE, NULL, NULL);

-- Mike Chen (p2) - Tuesday to Saturday, 10 AM to 7 PM
INSERT INTO personnel_working_hours (personnel_id, day_of_week, is_working, start_time, end_time) VALUES
('p2', 'monday', FALSE, NULL, NULL),
('p2', 'tuesday', TRUE, '10:00:00', '19:00:00'),
('p2', 'wednesday', TRUE, '10:00:00', '19:00:00'),
('p2', 'thursday', TRUE, '10:00:00', '19:00:00'),
('p2', 'friday', TRUE, '10:00:00', '19:00:00'),
('p2', 'saturday', TRUE, '10:00:00', '19:00:00'),
('p2', 'sunday', FALSE, NULL, NULL);

-- Emma Davis (p3) - Monday, Wednesday, Friday, Saturday
INSERT INTO personnel_working_hours (personnel_id, day_of_week, is_working, start_time, end_time) VALUES
('p3', 'monday', TRUE, '09:00:00', '17:00:00'),
('p3', 'tuesday', FALSE, NULL, NULL),
('p3', 'wednesday', TRUE, '09:00:00', '17:00:00'),
('p3', 'thursday', FALSE, NULL, NULL),
('p3', 'friday', TRUE, '09:00:00', '17:00:00'),
('p3', 'saturday', TRUE, '10:00:00', '16:00:00'),
('p3', 'sunday', FALSE, NULL, NULL);

-- David Wilson (p4) - Monday to Thursday, 11 AM to 8 PM
INSERT INTO personnel_working_hours (personnel_id, day_of_week, is_working, start_time, end_time) VALUES
('p4', 'monday', TRUE, '11:00:00', '20:00:00'),
('p4', 'tuesday', TRUE, '11:00:00', '20:00:00'),
('p4', 'wednesday', TRUE, '11:00:00', '20:00:00'),
('p4', 'thursday', TRUE, '11:00:00', '20:00:00'),
('p4', 'friday', FALSE, NULL, NULL),
('p4', 'saturday', FALSE, NULL, NULL),
('p4', 'sunday', FALSE, NULL, NULL);
