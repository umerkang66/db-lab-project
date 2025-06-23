-- SCHEMA / TABLES
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'customer', -- admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100),
    description TEXT,
    price DECIMAL(10, 2),
    stock_quantity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE addresses (
    address_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    address_line TEXT,
    city VARCHAR(50),
    postal_code VARCHAR(10),
    country VARCHAR(50)
);

CREATE TABLE orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    address_id UUID REFERENCES addresses(address_id),
    status VARCHAR(20) DEFAULT 'unpaid', -- unpaid / paid
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    order_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(order_id),
    product_id UUID REFERENCES products(product_id),
    quantity INT
);

CREATE TABLE cart (
    cart_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    product_id UUID REFERENCES products(product_id),
    quantity INT
);

CREATE TABLE payments (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(order_id), -- code / card
    payment_method VARCHAR(50),
    amount DECIMAL(10, 2),
    status VARCHAR(20), -- paid, pending, failed
    paid_at TIMESTAMP
);

-- INSERTING DATA QUERIES
INSERT INTO users (name, email, password, role)
VALUES 
  ('Alice Johnson', 'alice@example.com', 'hashedpass1', 'customer'),
  ('Bob Khan', 'bob@example.com', 'hashedpass2', 'customer'),
  ('Admin User', 'admin@store.com', 'adminhashedpass', 'admin');

INSERT INTO products (name, description, price, stock_quantity)
VALUES 
  ('Wireless Mouse', 'Ergonomic wireless mouse with USB receiver', 1499.99, 25),
  ('Bluetooth Headphones', 'Over-ear noise-cancelling headphones', 4999.50, 15),
  ('Mechanical Keyboard', 'RGB backlit mechanical keyboard', 3299.00, 10),
  ('Webcam HD 1080p', 'High-resolution USB webcam for streaming', 2199.75, 30),
  ('USB-C Charger', 'Fast charging USB-C power adapter', 899.00, 50);

INSERT INTO addresses (user_id, address_line, city, postal_code, country)
VALUES 
  ('e77f5446-84d2-424a-9a3a-5dda2a604505', '123 Main Street', 'Lahore', '54000', 'Pakistan'),
  ('ebe7c3df-d09f-43dc-862a-557f0ccc5614', '45 Garden Ave', 'Karachi', '75500', 'Pakistan');

-- ADD 2 ITEMS IN CART
SELECT * from users;
Select * from products;

INSERT INTO cart (user_id, product_id, quantity)
VALUES (
    '88c7e2a1-9ba4-46bc-85ce-df6dfda45870',
    '3ba98704-4ddf-4688-ab90-7dc191ee87c7',
    2
);
INSERT INTO cart (user_id, product_id, quantity)
VALUES (
    '88c7e2a1-9ba4-46bc-85ce-df6dfda45870',
    '95de6864-7a8e-4851-9f5f-3b6acd419d2e',
    2
);

-- NOW CREATE ORDER
-- Create the address of user
-- Get all the items from the cart
-- Create the order and order items
-- Then remove these items from the cart.
SELECT * FROM users;
SELECT * FROM addresses;

INSERT INTO addresses (user_id, address_line, city, postal_code, country)
VALUES 
  ('88c7e2a1-9ba4-46bc-85ce-df6dfda45870', 'UMT Johar Town', 'Lahore', '54000', 'Pakistan');

INSERT INTO orders (user_id, address_id, status)
VALUES (
    '88c7e2a1-9ba4-46bc-85ce-df6dfda45870',
    '3282e74c-763e-42e2-bbec-4246df28977f',
    'unpaid'
);

SELECT * FROM orders;
SELECT * FROM cart;

INSERT INTO order_items (order_id, product_id, quantity)
VALUES (
    'a037ca5e-9ad3-4a26-b6e1-80440598a9af',
    '3ba98704-4ddf-4688-ab90-7dc191ee87c7',
    2
), (
    'a037ca5e-9ad3-4a26-b6e1-80440598a9af',
    '95de6864-7a8e-4851-9f5f-3b6acd419d2e',
    2
);

SELECT * FROM order_items;

-- Delete items from the cart, that have been added to the order
DELETE FROM cart WHERE 
product_id = '3ba98704-4ddf-4688-ab90-7dc191ee87c7' 
OR product_id  = '95de6864-7a8e-4851-9f5f-3b6acd419d2e';
SELECT * FROM cart;

-- PAYMENTS
-- Now create the payment of order that we create
-- above and update the status of order to paid
-- Get the total amount of order by order_id
SELECT 
    SUM(oi.quantity * p.price) AS total_amount
FROM 
    order_items oi
JOIN 
    products p ON oi.product_id = p.product_id
WHERE 
    oi.order_id = 'a037ca5e-9ad3-4a26-b6e1-80440598a9af';

INSERT INTO payments(order_id, payment_method, amount, status, paid_at)
VALUES (
    'a037ca5e-9ad3-4a26-b6e1-80440598a9af',
    'cod',
    14398, 
    'paid',
    CURRENT_TIMESTAMP
);

SELECT * FROM payments;
