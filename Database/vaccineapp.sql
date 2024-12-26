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
    name NVARCHAR(255) NOT NULL          -- Tên tỉnh/thành phố
);

CREATE TABLE districts (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,         -- Tên huyện/quận
    province_id BIGINT,                  -- Mã tỉnh/thành phố
    FOREIGN KEY (province_id) REFERENCES provinces(id)
);

CREATE TABLE wards (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,         -- Tên xã/phường
    district_id BIGINT,                  -- Mã huyện/quận
    FOREIGN KEY (district_id) REFERENCES districts(id)
);

CREATE TABLE citizens (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    full_name NVARCHAR(255) NOT NULL,    -- Họ tên công dân
    date_of_birth DATE,                  -- Ngày sinh
    phone_number VARCHAR(20),            -- Số điện thoại
    ward_id BIGINT,                      -- Mã xã/phường
    address_detail NVARCHAR(255),        -- Địa chỉ chi tiết
    target_group VARCHAR(20) CHECK (target_group IN ('CHILD', 'ELDERLY', 'PREGNANT_WOMEN', 'OTHER')) DEFAULT 'OTHER',
    FOREIGN KEY (ward_id) REFERENCES wards(id)
);

CREATE TABLE vaccines (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,         -- Tên vắc xin
    manufacturer NVARCHAR(255),          -- Nhà sản xuất
    expiration_date DATE,                -- Ngày hết hạn
    quantity INT,                        -- Số lượng vắc xin còn lại
    description NVARCHAR(MAX)            -- Mô tả chi tiết vắc xin
);

CREATE TABLE vaccine_details (
    detail_id BIGINT PRIMARY KEY IDENTITY(1,1),   -- ID tự động tăng của chi tiết vắc xin
    vaccine_id BIGINT NOT NULL,                   -- Khóa ngoại tham chiếu tới bảng vaccines
    provider_name NVARCHAR(255),                  -- Tên nhà cung cấp vắc xin
    price DECIMAL(18, 2),                         -- Giá của vắc xin
    status NVARCHAR(50),                          -- Trạng thái của vắc xin (ví dụ: "In stock", "Out of stock")
    FOREIGN KEY (vaccine_id) REFERENCES vaccines(id)  -- Thiết lập khóa ngoại tới bảng vaccines
);

CREATE TABLE registrations (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    citizen_id BIGINT,                  -- Mã công dân
    vaccine_id BIGINT,                  -- Mã vắc xin
    registration_date DATE,             -- Ngày đăng ký
    location NVARCHAR(255),             -- Địa điểm tiêm
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
INSERT INTO users (username, password, role, enabled) 
VALUES ('admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'ADMIN', 1);

-- Thêm dữ liệu các tỉnh/thành phố
INSERT INTO provinces (name) VALUES 
(N'Hà Nội'),
(N'Hồ Chí Minh'),
(N'Đà Nẵng'),
(N'Hải Phòng'),
(N'Cần Thơ');

-- Thêm dữ liệu các huyện/quận
INSERT INTO districts (name, province_id) VALUES
(N'Ba Đình', 1),  
(N'Hoàn Kiếm', 1),
(N'Quận 1', 2),   
(N'Quận 3', 2),
(N'Ngũ Hành Sơn', 3);

-- Thêm dữ liệu các xã/phường
INSERT INTO wards (name, district_id) VALUES
(N'Phường Trúc Bạch', 1),  
(N'Phường Hàng Bài', 2),   
(N'Phường Bến Nghé', 3),   
(N'Phường Phạm Ngũ Lão', 4),
(N'Phường Hòa Hải', 5);

-- Thêm dữ liệu vắc xin
INSERT INTO vaccines (name, manufacturer, expiration_date, quantity, description) VALUES
('Pfizer', 'Pfizer Inc.', '2025-12-31', 1000, N'Vắc xin phòng COVID-19'),
('AstraZeneca', 'AstraZeneca', '2024-11-30', 800, N'Vắc xin phòng COVID-19'),
('Moderna', 'Moderna', '2025-06-15', 1200, N'Vắc xin phòng COVID-19');

-- Giả sử vaccine_id là 1 cho Pfizer, 2 cho AstraZeneca, và 3 cho Moderna.
-- Thêm chi tiết vắc xin
INSERT INTO vaccine_details (vaccine_id, provider_name, price, status) VALUES
(1, N'Nhà cung cấp Pfizer', 19.99, 'In stock'),
(2, N'Nhà cung cấp AstraZeneca', 15.50, 'In stock'),
(3, N'Nhà cung cấp Moderna', 22.00, 'Out of stock'),
(1, N'Nhà cung cấp Pfizer 2', 18.75, 'In stock'),
(2, N'Nhà cung cấp AstraZeneca 2', 16.00, 'Out of stock');

-- Thêm dữ liệu công dân
INSERT INTO citizens (full_name, date_of_birth, phone_number, ward_id, address_detail, target_group) 
VALUES 
(N'Nguyễn Văn A', '1985-05-20', '0912345678', 1, N'Số 12, Đường Trần Phú', 'OTHER'),
(N'Trần Thị B', '1990-08-15', '0987654321', 2, N'Số 54, Đường Nguyễn Trãi', 'ELDERLY'),
(N'Phạm Văn C', '2005-11-10', '0922334455', 3, N'Số 45/6/1 Đường Lê Lợi', 'CHILD');

-- Thêm dữ liệu đăng ký tiêm
INSERT INTO registrations (citizen_id, vaccine_id, registration_date, vaccination_date, location, status) VALUES
(1, 1, '2024-12-01', '2024-12-10', N'Trung tâm y tế Ba Đình', 'PENDING'),
(2, 2, '2024-12-05', '2024-12-12', N'Trung tâm y tế Hoàn Kiếm', 'PENDING');

-- Thêm lịch sử tiêm
INSERT INTO vaccination_history (citizen_id, vaccine_id, vaccination_date, status) VALUES
(1, 1, '2024-12-10', 'COMPLETED'),
(2, 2, '2024-12-12', 'COMPLETED');
