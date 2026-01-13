-- Seed Demo Data
-- Password for all users: 'password123' -> $2b$10$tFQCQG6g0dqv.xlrVnfrV.uk8E4wCBrWwT8BLCKrUpoLD2wPik3RG

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Create Schools
INSERT INTO `schools` (`id`, `name`, `address`, `is_active`) VALUES
(1, 'Greenfield High', '123 Green St, Cityville', 1),
(2, 'Sunrise Academy', '456 Sun Rd, Townsville', 1);

-- 2. Create Users (School Admins, Teachers, Students, Parents)
-- Role IDs: 1=SA, 2=SchoolAdmin, 4=Teacher, 5=Student, 6=Parent (Assuming 3 might be unused or similar)

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role_id`, `school_id`, `is_active`) VALUES
-- School Admins
(2, 'Admin Greenfield', 'admin@greenfield.com', '$2b$10$tFQCQG6g0dqv.xlrVnfrV.uk8E4wCBrWwT8BLCKrUpoLD2wPik3RG', 2, 1, 1),
(3, 'Admin Sunrise', 'admin@sunrise.com', '$2b$10$tFQCQG6g0dqv.xlrVnfrV.uk8E4wCBrWwT8BLCKrUpoLD2wPik3RG', 2, 2, 1),

-- Teachers (Greenfield)
(4, 'John Doe (Teacher)', 'john@greenfield.com', '$2b$10$tFQCQG6g0dqv.xlrVnfrV.uk8E4wCBrWwT8BLCKrUpoLD2wPik3RG', 4, 1, 1),
(5, 'Jane Smith (Teacher)', 'jane@greenfield.com', '$2b$10$tFQCQG6g0dqv.xlrVnfrV.uk8E4wCBrWwT8BLCKrUpoLD2wPik3RG', 4, 1, 1),

-- Teachers (Sunrise)
(6, 'Bob Brown (Teacher)', 'bob@sunrise.com', '$2b$10$tFQCQG6g0dqv.xlrVnfrV.uk8E4wCBrWwT8BLCKrUpoLD2wPik3RG', 4, 2, 1),

-- Students (Greenfield)
(7, 'Alice Student', 'alice@student.com', '$2b$10$tFQCQG6g0dqv.xlrVnfrV.uk8E4wCBrWwT8BLCKrUpoLD2wPik3RG', 5, 1, 1),
(8, 'Charlie Student', 'charlie@student.com', '$2b$10$tFQCQG6g0dqv.xlrVnfrV.uk8E4wCBrWwT8BLCKrUpoLD2wPik3RG', 5, 1, 1),

-- Parents
(9, 'Papa Alice', 'parent@alice.com', '$2b$10$tFQCQG6g0dqv.xlrVnfrV.uk8E4wCBrWwT8BLCKrUpoLD2wPik3RG', 6, 1, 1);

-- 3. Create Classes
INSERT INTO `classes` (`id`, `name`, `school_id`) VALUES
(1, 'Class 10-A', 1), -- Greenfield
(2, 'Class 9-B', 1),  -- Greenfield
(3, 'Class 5-A', 2);  -- Sunrise

-- 4. Create Subjects
INSERT INTO `subjects` (`id`, `name`, `school_id`, `class_id`, `teacher_id`) VALUES
-- Greenfield Class 10-A
(1, 'Mathematics', 1, 1, 4), -- John
(2, 'Science', 1, 1, 5),      -- Jane
(3, 'English', 1, 1, 4),      -- John

-- Greenfield Class 9-B
(4, 'History', 1, 2, 5),      -- Jane

-- Sunrise Class 5-A
(5, 'Art', 2, 3, 6);          -- Bob

-- 5. Link Teachers as Class Admins
INSERT INTO `class_admin_profiles` (`user_id`, `class_id`) VALUES
(4, 1); -- John is Admin of 10-A

-- 6. Create Student Profiles
INSERT INTO `student_profiles` (`user_id`, `enrollment_no`, `class_id`, `school_id`, `gender`) VALUES
(7, 'ENR001', 1, 1, 'Female'), -- Alice in 10-A
(8, 'ENR002', 2, 1, 'Male');   -- Charlie in 9-B

-- 7. Link Parents
INSERT INTO `parent_student` (`parent_id`, `student_id`) VALUES
(9, 7); -- Papa Alice -> Alice

-- 8. Create Timetable (Demo)
INSERT INTO `timetable` (`school_id`, `class_id`, `subject_id`, `teacher_id`, `day_of_week`, `start_time`, `end_time`) VALUES
(1, 1, 1, 4, 'Monday', '09:00:00', '10:00:00'), -- Math 10-A Mon
(1, 1, 2, 5, 'Monday', '10:00:00', '11:00:00'), -- Science 10-A Mon
(1, 1, 3, 4, 'Tuesday', '09:00:00', '10:00:00'); -- English 10-A Tue

-- 9. Create Homework
INSERT INTO `homework` (`title`, `description`, `school_id`, `class_id`, `subject_id`, `assigned_by_role_id`, `created_by`, `created_at`) VALUES
('Algebra Worksheet', 'Complete ex 1.1 to 1.5', 1, 1, 1, 4, 4, NOW()),
('Science Project', 'Make a volcano model', 1, 1, 2, 4, 5, NOW());

-- 10. Create Live Classes
INSERT INTO `live_classes` (`title`, `url`, `start_time`, `status`, `class_id`, `subject_id`, `school_id`, `teacher_id`, `uploaded_by_role`, `uploaded_by_user_id`) VALUES
('Morning Math Session', 'https://meet.google.com/abc-demo', DATE_ADD(NOW(), INTERVAL 1 DAY), 'scheduled', 1, 1, 1, 4, 4, 4);

-- 11. Share Live Class with same class (pivot)
INSERT INTO `live_class_shares` (`live_class_id`, `class_id`) VALUES
(LAST_INSERT_ID(), 1);

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Demo data seeded successfully.' as message;
