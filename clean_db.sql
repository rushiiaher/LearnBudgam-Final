-- Disable foreign key checks to allow truncation
SET FOREIGN_KEY_CHECKS = 0;

-- Truncate transactional and linking tables (Order matters less with FK checks off, but good practice)
TRUNCATE TABLE `attendance`;
TRUNCATE TABLE `student_attendance`;
TRUNCATE TABLE `parent_student`;
TRUNCATE TABLE `class_admin_profiles`;
TRUNCATE TABLE `subject_classes`;
TRUNCATE TABLE `live_class_shares`;
TRUNCATE TABLE `live_classes`;
TRUNCATE TABLE `homework`;
TRUNCATE TABLE `timetable`;

-- Truncate entity tables (except users and roles)
TRUNCATE TABLE `student_profiles`;
TRUNCATE TABLE `subjects`;
TRUNCATE TABLE `classes`;
TRUNCATE TABLE `schools`;

-- Clean users table, but PRESERVE Super Admin (Role ID 1)
-- Assuming Super Admin has role_id = 1.
DELETE FROM `users` WHERE `role_id` != 1;

-- Reset Super Admin Password to 'password123'
-- Hash: $2b$10$tFQCQG6g0dqv.xlrVnfrV.uk8E4wCBrWwT8BLCKrUpoLD2wPik3RG
UPDATE `users` 
SET `password` = '$2b$10$tFQCQG6g0dqv.xlrVnfrV.uk8E4wCBrWwT8BLCKrUpoLD2wPik3RG', 
    `school_id` = NULL 
WHERE `role_id` = 1;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Database cleaned. Super Admin preserved and password reset.' as message;
