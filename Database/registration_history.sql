
CREATE DATABASE registration_management;
USE registration_management;

CREATE TABLE registrations (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    citizen_id BIGINT,
    vaccine_id BIGINT,
    registration_date DATE,
    location NVARCHAR(255),
    status VARCHAR(10) CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED')) DEFAULT 'PENDING'
);

-- CREATE TABLE vaccination_history (
--     id BIGINT PRIMARY KEY IDENTITY(1,1),
--     citizen_id BIGINT,
--     vaccine_id BIGINT,
--     vaccination_date DATE,
--     status VARCHAR(10) CHECK (status IN ('COMPLETED', 'MISSED')) DEFAULT 'COMPLETED'
-- );

-- Thêm dữ liệu đăng ký tiêm
-- INSERT INTO registrations (citizen_id, vaccine_id, registration_date, location, status) VALUES
-- (1, 1, '2024-12-01', N'Trung tâm y tế Ba Đình', 'PENDING');

-- Thêm lịch sử tiêm
INSERT INTO vaccination_history (citizen_id, vaccine_id, vaccination_date, status) VALUES
(1, 1, '2024-12-10', 'COMPLETED');
