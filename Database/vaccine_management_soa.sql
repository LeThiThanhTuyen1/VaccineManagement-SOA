
CREATE DATABASE vaccine_management_soa;
USE vaccine_management_soa;

CREATE TABLE vaccines (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    manufacturer NVARCHAR(255),
    expiration_date DATE,
    quantity INT,
    description NVARCHAR(MAX)
);

CREATE TABLE vaccine_details (
    detail_id BIGINT PRIMARY KEY IDENTITY(1,1),
    vaccine_id BIGINT NOT NULL,
    provider_name NVARCHAR(255),
    price DECIMAL(18, 2),
    status NVARCHAR(50),
    FOREIGN KEY (vaccine_id) REFERENCES vaccines(id)
);

-- Thêm dữ liệu vắc xin
INSERT INTO vaccines (name, manufacturer, expiration_date, quantity, description) VALUES
('Pfizer', 'Pfizer Inc.', '2025-12-31', 1000, N'Vắc xin phòng COVID-19'),
('AstraZeneca', 'AstraZeneca', '2024-11-30', 800, N'Vắc xin phòng COVID-19');

-- Thêm chi tiết vắc xin
INSERT INTO vaccine_details (vaccine_id, provider_name, price, status) VALUES
(1, N'Nhà cung cấp Pfizer', 19.99, 'In stock'),
(2, N'Nhà cung cấp AstraZeneca', 15.50, 'In stock');

