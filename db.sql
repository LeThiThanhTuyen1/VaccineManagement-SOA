CREATE DATABASE vaccine_management_soa;
USE vaccine_management_soa;

CREATE TABLE User (
  IdUser INT AUTO_INCREMENT PRIMARY KEY,
  UserName VARCHAR(255) NOT NULL,
  Password VARCHAR(255) NOT NULL,
  Token VARCHAR(255)
);
INSERT INTO User (UserName, Password) VALUES
('admin', MD5('password123')), 
('user', MD5('userpassword'));

CREATE TABLE provinces (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL          -- Tên tỉnh/thành phố
);
CREATE TABLE districts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,         -- Tên huyện/quận
    province_id BIGINT,                 -- Mã tỉnh/thành phố
    FOREIGN KEY (province_id) REFERENCES provinces(id) -- Liên kết tới bảng provinces
);
CREATE TABLE wards (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,         -- Tên xã/phường
    district_id BIGINT,                 -- Mã huyện/quận
    FOREIGN KEY (district_id) REFERENCES districts(id) -- Liên kết tới bảng districts
);
CREATE TABLE citizens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,    -- Họ tên công dân
    date_of_birth DATE,                 -- Ngày sinh
    phone_number VARCHAR(20),           -- Số điện thoại
    ward_id BIGINT,                     -- Mã xã/phường
    address_detail VARCHAR(255),        -- Địa chỉ chi tiết (nhà số, đường, v.v.)
    target_group ENUM('CHILD', 'ELDERLY', 'PREGNANT_WOMEN', 'RISK_GROUP') DEFAULT 'RISK_GROUP', -- Nhóm đối tượng
    FOREIGN KEY (ward_id) REFERENCES wards(id) -- Liên kết tới bảng xã/phường
);
CREATE TABLE vaccines (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,        -- Tên vắc xin
    manufacturer VARCHAR(255),         -- Nhà sản xuất
    expiration_date DATE,              -- Ngày hết hạn
    quantity INT,                      -- Số lượng vắc xin còn lại
    description TEXT                   -- Mô tả chi tiết vắc xin
);
CREATE TABLE registrations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    citizen_id BIGINT,                  -- Mã công dân
    vaccine_id BIGINT,                  -- Mã vắc xin
    registration_date DATE,             -- Ngày đăng ký
    vaccination_date DATE,              -- Ngày dự kiến tiêm
    location VARCHAR(255),              -- Địa điểm tiêm
    status ENUM('PENDING', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING', -- Trạng thái tiêm chủng
    FOREIGN KEY (citizen_id) REFERENCES citizens(id),
    FOREIGN KEY (vaccine_id) REFERENCES vaccines(id)
);
CREATE TABLE vaccination_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    citizen_id BIGINT,                  -- Mã công dân
    vaccine_id BIGINT,                  -- Mã vắc xin
    vaccination_date DATE,              -- Ngày đã tiêm
    status ENUM('COMPLETED', 'MISSED') DEFAULT 'COMPLETED', -- Trạng thái tiêm
    FOREIGN KEY (citizen_id) REFERENCES citizens(id),
    FOREIGN KEY (vaccine_id) REFERENCES vaccines(id)
);