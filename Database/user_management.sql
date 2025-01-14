CREATE DATABASE user_management;
USE user_management;

CREATE TABLE users (
  id INT PRIMARY KEY IDENTITY(1,1),
  username VARCHAR(45) NOT NULL,
  password VARCHAR(225) NOT NULL,
  role VARCHAR(10) CHECK (role IN ('MANAGER', 'ADMIN')),
  enabled BIT NOT NULL DEFAULT 0
);

-- Thêm tài khoản
INSERT INTO users (username, password, role, enabled) 
VALUES ('admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'ADMIN', 1);
