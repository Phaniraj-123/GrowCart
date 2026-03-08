

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'admin') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  method ENUM('card', 'upi', 'cod', 'netbanking') DEFAULT 'card',
  status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
  paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  street VARCHAR(255) NOT NULL,
  apt VARCHAR(100),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip VARCHAR(10) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  is_default TINYINT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY unique_review (product_id, user_id)
);

ALTER TABLE products ADD COLUMN category VARCHAR(100) DEFAULT 'general';

INSERT INTO products (name, description, price, stock, image_url, category) VALUES
('Insecticide ABC', 'Effective against all insects', 199, 100, 'imageshop/pestisides1.jpg', 'pesticides'),
('Fungicide XYZ', 'Prevents fungal growth', 159, 80, 'imageshop/pestisides2.jpg', 'pesticides'),
('Herbicide DEF', 'Removes unwanted weeds', 199, 60, 'imageshop/pestiside3.jpg', 'pesticides'),
('Organic Compost', 'Natural soil enricher', 99, 120, 'imageshop/pestisides4.jpg', 'organic'),
('Organic Neem Oil', 'Natural pest repellent', 129, 90, 'imageshop/pestisides5.webp', 'organic');

USE shopdb;
ALTER TABLE users ADD COLUMN mobile VARCHAR(15) DEFAULT NULL;

SELECT * FROM users;

SET SQL_SAFE_UPDATES = 0;
DELETE FROM order_items;
DELETE FROM payments;
DELETE FROM orders;
SET SQL_SAFE_UPDATES = 1;

ALTER TABLE orders MODIFY status ENUM('pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending';

USE shopdb;
INSERT INTO products (name, description, price, stock, image_url, category) VALUES
('Tomato Seeds', 'High yield hybrid tomato seeds', 12.99, 200, 'imageshop/seeds1.jpg', 'seeds'),
('Onion Seeds', 'Premium onion seeds for all seasons', 9.99, 150, 'imageshop/seeds2.jpg', 'seeds'),
('Spray Equipment', 'Manual pressure sprayer 5L', 49.99, 50, 'imageshop/equip1.jpg', 'equipment'),
('Garden Tools Kit', 'Complete 5 piece garden tool set', 34.99, 40, 'imageshop/equip2.jpg', 'equipment'),
('Crop Shield', 'All weather crop protection cover', 24.99, 80, 'imageshop/protect1.jpg', 'protection'),
('Fungal Guard', 'Prevents fungal infections on crops', 19.99, 100, 'imageshop/protect2.jpg', 'protection'),
('NPK Fertilizer', 'Balanced nitrogen phosphorus potassium', 29.99, 120, 'imageshop/nutri1.jpg', 'nutrients'),
('Organic Compost Plus', 'Enriched organic compost mix', 18.99, 90, 'imageshop/nutri2.jpg', 'nutrients');

SET SQL_SAFE_UPDATES = 0;
UPDATE products SET image_url = 'imageshop/pestisides1.jpg' WHERE category = 'seeds';
UPDATE products SET image_url = 'imageshop/pestisides2.jpg' WHERE category = 'equipment';
UPDATE products SET image_url = 'imageshop/pestiside3.jpg' WHERE category = 'protection';
UPDATE products SET image_url = 'imageshop/pestisides4.jpg' WHERE category = 'nutrients';

USE shopdb;
INSERT INTO products (name, description, price, stock, image_url, category) VALUES
('Drip Kit', 'Complete drip irrigation kit', 89.99, 30, 'imageshop/pestisides1.jpg', 'irrigation');

ALTER TABLE products ADD COLUMN avg_rating DECIMAL(2,1) DEFAULT 0;
ALTER TABLE products ADD COLUMN review_count INT DEFAULT 0;

ALTER TABLE products ADD COLUMN variants JSON DEFAULT NULL;

SET SQL_SAFE_UPDATES = 0;

UPDATE products SET variants = '{"1L": 199.00, "500ml": 149.00, "250ml": 99.00}' WHERE category = 'pesticides';
UPDATE products SET variants = '{"1L": 199.00, "500ml": 149.00, "250ml": 99.00}' WHERE category = 'organic';
UPDATE products SET variants = '{"1L": 199.00, "500ml": 149.00, "250ml": 99.00}' WHERE category = 'protection';
UPDATE products SET variants = '{"1L": 199.00, "500ml": 149.00, "250ml": 99.00}' WHERE category = 'nutrients';

-- Clear existing products
SET SQL_SAFE_UPDATES = 0;
DELETE FROM order_items;
DELETE FROM payments;
DELETE FROM orders;
DELETE FROM reviews;
DELETE FROM products;
SET SQL_SAFE_UPDATES = 1;

-- Vegetables (was pesticides)
INSERT INTO products (name, description, price, stock, image_url, category) VALUES
('Fresh Tomatoes', 'Farm fresh red tomatoes, rich in vitamins', 2.99, 500, 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=300', 'vegetables'),
('Green Spinach', 'Organic baby spinach, washed and ready', 1.99, 300, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300', 'vegetables'),
('Carrots', 'Crunchy farm carrots, perfect for cooking', 2.49, 400, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300', 'vegetables'),
('Broccoli', 'Fresh green broccoli, high in fiber', 3.49, 200, 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=300', 'vegetables'),
('Bell Peppers', 'Colorful mixed bell peppers', 3.99, 250, 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=300', 'vegetables'),
('Onions', 'Fresh red onions, kitchen essential', 1.49, 600, 'https://images.unsplash.com/photo-1508747703725-719777637510?w=300', 'vegetables'),

-- Fruits (was seeds)
('Bananas', 'Fresh yellow bananas, energy rich', 1.99, 500, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300', 'fruits'),
('Red Apples', 'Crisp and sweet red apples', 3.99, 300, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300', 'fruits'),
('Mangoes', 'Sweet Alphonso mangoes', 5.99, 200, 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300', 'fruits'),
('Strawberries', 'Fresh juicy strawberries', 4.99, 150, 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=300', 'fruits'),
('Oranges', 'Juicy navel oranges, vitamin C rich', 2.99, 400, 'https://images.unsplash.com/photo-1547514701-42782101795e?w=300', 'fruits'),
('Grapes', 'Seedless green grapes', 3.49, 250, 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=300', 'fruits'),

-- Milk & Curd (was equipment)
('Full Cream Milk', 'Fresh pasteurized full cream milk 1L', 2.49, 400, 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300', 'dairy'),
('Greek Yogurt', 'Thick and creamy Greek yogurt', 3.99, 200, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300', 'dairy'),
('Cheddar Cheese', 'Aged cheddar cheese block', 5.99, 150, 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=300', 'dairy'),
('Butter', 'Creamy unsalted butter 250g', 3.49, 300, 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300', 'dairy'),

-- Grocery (was protection)
('Basmati Rice', 'Premium aged basmati rice 2lb', 6.99, 300, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300', 'grocery'),
('Whole Wheat Bread', 'Freshly baked whole wheat bread', 3.49, 200, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300', 'grocery'),
('Olive Oil', 'Extra virgin olive oil 500ml', 8.99, 150, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300', 'grocery'),
('Pasta', 'Italian durum wheat pasta 500g', 2.99, 250, 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=300', 'grocery'),

-- Detergents (was organic)
('Dish Soap', 'Gentle lemon dish washing soap', 3.99, 300, 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=300', 'detergents'),
('Laundry Detergent', 'Fresh scent laundry detergent 1kg', 9.99, 200, 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300', 'detergents'),
('Floor Cleaner', 'Antibacterial floor cleaner 1L', 4.99, 150, 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300', 'detergents'),
('Hand Wash', 'Moisturizing antibacterial hand wash', 2.99, 400, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300', 'detergents'),

-- Chips & Snacks (was nutrients)
('Potato Chips', 'Crispy salted potato chips 150g', 2.49, 500, 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300', 'snacks'),
('Popcorn', 'Butter flavored microwave popcorn', 3.49, 300, 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=300', 'snacks'),
('Chocolate Cookies', 'Crunchy chocolate chip cookies', 3.99, 250, 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300', 'snacks'),
('Mixed Nuts', 'Premium roasted mixed nuts 200g', 6.99, 200, 'https://images.unsplash.com/photo-1536591375667-97f705c3c0d0?w=300', 'snacks'),

-- Soft Drinks (was irrigation)
('Coca Cola', 'Refreshing Coca Cola 500ml', 1.99, 600, 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300', 'beverages'),
('Orange Juice', 'Fresh squeezed orange juice 1L', 4.99, 300, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300', 'beverages'),
('Sparkling Water', 'Natural sparkling mineral water', 1.49, 400, 'https://images.unsplash.com/photo-1598343672916-6a03ce6d0b0b?w=300', 'beverages'),
('Green Tea', 'Premium Japanese green tea', 3.99, 250, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300', 'beverages');

INSERT INTO products (name, description, price, stock, image_url, category) VALUES
('Dairy Milk', 'Creamy Cadbury Dairy Milk chocolate 100g', 3.99, 300, 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=300', 'chocolates'),
('Dark Chocolate', 'Premium 70% dark chocolate bar', 4.99, 200, 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=300', 'chocolates'),
('Kit Kat', 'Crispy wafer chocolate bar', 2.49, 400, 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300', 'chocolates'),
('Ferrero Rocher', 'Premium hazelnut chocolate box 16pc', 12.99, 100, 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=300', 'chocolates'),

('Colgate Toothpaste', 'Whitening fluoride toothpaste 150g', 3.49, 400, 'https://images.unsplash.com/photo-1559591935-c5c9fa0c1b38?w=300', 'oralcare'),
('Mouthwash', 'Antibacterial mint mouthwash 500ml', 5.99, 200, 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=300', 'oralcare'),
('Toothbrush', 'Soft bristle toothbrush pack of 3', 4.99, 300, 'https://images.unsplash.com/photo-1559591935-c5c9fa0c1b38?w=300', 'oralcare'),
('Dental Floss', 'Mint waxed dental floss 50m', 2.99, 250, 'https://images.unsplash.com/photo-1559591935-c5c9fa0c1b38?w=300', 'oralcare');


USE shopdb;
ALTER TABLE users ADD COLUMN is_admin TINYINT(1) DEFAULT 0;
UPDATE users SET is_admin = 1 WHERE email = 'your_email@gmail.com';

UPDATE users SET is_admin = 1 WHERE email = 'your_email@gmail.com';
SELECT id, name, email, is_admin FROM users;

UPDATE users SET email = 'admin@greencart.com' WHERE id = 3;
SELECT id, email, is_admin FROM users WHERE id = 3;

DESCRIBE orders;