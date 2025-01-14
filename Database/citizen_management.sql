CREATE DATABASE citizen_management;
USE citizen_management;

CREATE TABLE provinces (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL
);

CREATE TABLE districts (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    province_id BIGINT,
    FOREIGN KEY (province_id) REFERENCES provinces(id)
);

CREATE TABLE wards (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    district_id BIGINT,
    FOREIGN KEY (district_id) REFERENCES districts(id)
);

CREATE TABLE citizens (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    full_name NVARCHAR(255) NOT NULL,
    date_of_birth DATE,
    phone_number VARCHAR(20),
    ward_id BIGINT,
    address_detail NVARCHAR(255),
    target_group VARCHAR(20) CHECK (target_group IN ('CHILD', 'ELDERLY', 'PREGNANT_WOMEN', 'OTHER')) DEFAULT 'OTHER',
    FOREIGN KEY (ward_id) REFERENCES wards(id)
);

-- Thêm dữ liệu các tỉnh/thành phố
INSERT INTO provinces (name) VALUES 
(N'Hà Nội'), (N'Hồ Chí Minh');

-- Thêm dữ liệu các huyện/quận
INSERT INTO districts (name, province_id) VALUES
(N'Ba Đình', 1), (N'Hoàn Kiếm', 1);

-- Thêm dữ liệu các xã/phường
INSERT INTO wards (name, district_id) VALUES
(N'Phường Trúc Bạch', 1), (N'Phường Hàng Bài', 2);

-- Thêm dữ liệu công dân
INSERT INTO citizens (full_name, date_of_birth, phone_number, ward_id, address_detail, target_group) 
VALUES 
(N'Nguyễn Văn A', '1985-05-20', '0912345678', 1, N'Số 12, Đường Trần Phú', 'OTHER');
