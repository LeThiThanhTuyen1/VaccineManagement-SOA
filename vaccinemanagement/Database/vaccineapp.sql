CREATE DATABASE vaccine_management;
USE vaccine_management;

CREATE TABLE users (
  id INT PRIMARY KEY IDENTITY(1,1),
  username VARCHAR(45) NOT NULL,
  password VARCHAR(225) NOT NULL,
  role VARCHAR(10) CHECK (role IN ('MANAGER', 'ADMIN')),
  enabled BIT NOT NULL DEFAULT 0
);

CREATE TABLE provinces (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(255) NOT NULL          -- Tên tỉnh/thành phố
);

CREATE TABLE districts (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(255) NOT NULL,         -- Tên huyện/quận
    province_id BIGINT,                 -- Mã tỉnh/thành phố
    FOREIGN KEY (province_id) REFERENCES provinces(id)
);

CREATE TABLE wards (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(255) NOT NULL,         -- Tên xã/phường
    district_id BIGINT,                 -- Mã huyện/quận
    FOREIGN KEY (district_id) REFERENCES districts(id)
);

CREATE TABLE citizens (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    full_name VARCHAR(255) NOT NULL,    -- Họ tên công dân
    date_of_birth DATE,                 -- Ngày sinh
    phone_number VARCHAR(20),           -- Số điện thoại
    ward_id BIGINT,                     -- Mã xã/phường
    address_detail VARCHAR(255),        -- Địa chỉ chi tiết
    target_group VARCHAR(20) CHECK (target_group IN ('CHILD', 'ELDERLY', 'PREGNANT_WOMEN', 'OTHER')) DEFAULT 'OTHER',
    FOREIGN KEY (ward_id) REFERENCES wards(id)
);

CREATE TABLE vaccines (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(255) NOT NULL,        -- Tên vắc xin
    manufacturer VARCHAR(255),         -- Nhà sản xuất
    expiration_date DATE,              -- Ngày hết hạn
    quantity INT,                      -- Số lượng vắc xin còn lại
    description TEXT                   -- Mô tả chi tiết vắc xin
);

CREATE TABLE registrations (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    citizen_id BIGINT,                  -- Mã công dân
    vaccine_id BIGINT,                  -- Mã vắc xin
    registration_date DATE,             -- Ngày đăng ký
    vaccination_date DATE,              -- Ngày dự kiến tiêm
    location VARCHAR(255),              -- Địa điểm tiêm
    status VARCHAR(10) CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED')) DEFAULT 'PENDING',
    FOREIGN KEY (citizen_id) REFERENCES citizens(id),
    FOREIGN KEY (vaccine_id) REFERENCES vaccines(id)
);

CREATE TABLE vaccination_history (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    citizen_id BIGINT,                  -- Mã công dân
    vaccine_id BIGINT,                  -- Mã vắc xin
    vaccination_date DATE,              -- Ngày đã tiêm
    status VARCHAR(10) CHECK (status IN ('COMPLETED', 'MISSED')) DEFAULT 'COMPLETED',
    FOREIGN KEY (citizen_id) REFERENCES citizens(id),
    FOREIGN KEY (vaccine_id) REFERENCES vaccines(id)
);

-- Thêm tài khoản
INSERT INTO users (id, username, password, role, enabled) 
VALUES (1, 'admin', '$2a$10$I21tJHZfr69zAScdkfr0UuMOVoq4ytSFTaBJcYkdygkv1TqhHQtR6', 'ADMIN', 1);

INSERT INTO provinces (name) VALUES 
('Hà Nội'),
('Hồ Chí Minh'),
('Đà Nẵng'),
('Hải Phòng'),
('Cần Thơ');

INSERT INTO districts (name, province_id) VALUES
('Ba Đình', 1),  
('Hoàn Kiếm', 1),
('Quận 1', 2),   
('Quận 3', 2),
('Ngũ Hành Sơn', 3);

INSERT INTO wards (name, district_id) VALUES
('Phường Trúc Bạch', 1),  
('Phường Hàng Bài', 2),   
('Phường Bến Nghé', 3),   
('Phường Phạm Ngũ Lão', 4),
('Phường Hòa Hải', 5);

INSERT INTO vaccines (name, manufacturer, expiration_date, quantity, description) VALUES
('Pfizer', 'Pfizer Inc.', '2025-12-31', 1000, 'Vắc xin phòng COVID-19'),
('AstraZeneca', 'AstraZeneca', '2024-11-30', 800, 'Vắc xin phòng COVID-19'),
('Moderna', 'Moderna', '2025-06-15', 1200, 'Vắc xin phòng COVID-19');

INSERT INTO citizens (full_name, date_of_birth, phone_number, ward_id, address_detail, target_group) 
VALUES 
('Nguyễn Văn A', '1985-05-20', '0912345678', 1, 'Số 12, Đường Trần Phú', 'OTHER'),
('Trần Thị B', '1990-08-15', '0987654321', 2, 'Số 54, Đường Nguyễn Trãi', 'ELDERLY'),
('Phạm Văn C', '2005-11-10', '0922334455', 3, 'Số 45/6/1 Đường Lê Lợi', 'CHILD');

INSERT INTO registrations (citizen_id, vaccine_id, registration_date, vaccination_date, location, status) VALUES
(1, 1, '2024-12-01', '2024-12-10', 'Trung tâm y tế Ba Đình', 'PENDING'),
(2, 2, '2024-12-05', '2024-12-12', 'Trung tâm y tế Hoàn Kiếm', 'PENDING');

INSERT INTO vaccination_history (citizen_id, vaccine_id, vaccination_date, status) VALUES
(1, 1, '2024-12-10', 'COMPLETED'),
(2, 2, '2024-12-12', 'COMPLETED');
