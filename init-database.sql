-- CHU TEA 数据库初始化脚本
-- 使用方法: mysql -uroot -p < init-database.sql

-- 创建数据库
CREATE DATABASE IF NOT EXISTS chu_tea_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户
CREATE USER IF NOT EXISTS 'chu_tea_user'@'localhost' IDENTIFIED BY 'chu_tea_pass_2024';

-- 授权
GRANT ALL PRIVILEGES ON chu_tea_db.* TO 'chu_tea_user'@'localhost';
FLUSH PRIVILEGES;

USE chu_tea_db;

-- 商品表已经通过Drizzle ORM创建，这里只插入初始数据

-- 确认数据库创建成功
SELECT 'Database chu_tea_db created successfully!' AS status;
