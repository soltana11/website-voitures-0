-- Database setup for benamotors
-- Import this file into phpMyAdmin to create the database and table

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS benamotors;
USE benamotors;

-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    km INT NOT NULL,
    price INT NOT NULL,
    image VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'available'
);

-- Optional: Insert sample data
INSERT INTO cars (name, year, km, price, image, description, status) VALUES
('Peugeot 208', 2020, 15000, 15000, 'images/car1.jpg', 'Voiture neuve en excellent état', 'available'),
('Renault Clio', 2019, 25000, 12000, 'images/car2.jpg', 'Économique et fiable', 'available'),
('Citroën C3', 2021, 8000, 18000, 'images/car3.jpg', 'Compacte et moderne', 'available');
