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
  ('7952dfe4-d5dd-4819-a754-0add28c92d77', '123 Main Street', 'Lahore', '54000', 'Pakistan'),
  ('3ac564c1-abbc-4fe6-bd24-46af0be5f67a', '45 Garden Ave', 'Karachi', '75500', 'Pakistan');

-- ADD 2 ITEMS IN CART
SELECT * from users;
Select * from products;

INSERT INTO cart (user_id, product_id, quantity)
VALUES (
    '3ac564c1-abbc-4fe6-bd24-46af0be5f67a',
    '495c3f31-135b-4296-8646-c53184ce8b98',
    2
);
INSERT INTO cart (user_id, product_id, quantity)
VALUES (
    '3ac564c1-abbc-4fe6-bd24-46af0be5f67a',
    '318cc4f3-376c-4cff-ae2e-f0f6889dca03',
    2
);

SELECT * FROM cart;

-- NOW CREATE ORDER
-- Create the address of user
-- Get all the items from the cart
-- Create the order and order items
-- Then remove these items from the cart.
SELECT * FROM users;
SELECT * FROM addresses;

INSERT INTO orders (user_id, address_id, status)
VALUES (
    '3ac564c1-abbc-4fe6-bd24-46af0be5f67a',
    '544f921e-b740-4423-8953-9c8ba7a2632a',
    'unpaid'
);

SELECT * FROM orders;
SELECT * FROM cart;

INSERT INTO order_items (order_id, product_id, quantity)
VALUES (
    '32ca02d5-bf55-416b-ae28-c5da9319dff6',
    '495c3f31-135b-4296-8646-c53184ce8b98',
    2
), (
    '32ca02d5-bf55-416b-ae28-c5da9319dff6',
    '318cc4f3-376c-4cff-ae2e-f0f6889dca03',
    2
);

SELECT * FROM order_items;

-- Delete items from the cart, that have been added to the order
SELECT * FROM cart;
DELETE FROM cart WHERE 
product_id = 
'495c3f31-135b-4296-8646-c53184ce8b98' 
OR product_id  = '318cc4f3-376c-4cff-ae2e-f0f6889dca03';
SELECT * FROM cart;

-- PAYMENTS
-- Now create the payment of order that we create
-- above and update the status of order to paid
-- Get the total amount of order by order_id
SELECT * FROM orders;

SELECT 
    SUM(oi.quantity * p.price) AS total_amount
FROM 
    order_items oi
JOIN 
    products p ON oi.product_id = p.product_id
WHERE 
    oi.order_id = '32ca02d5-bf55-416b-ae28-c5da9319dff6';

INSERT INTO payments(order_id, payment_method, amount, status, paid_at)
VALUES (
    '32ca02d5-bf55-416b-ae28-c5da9319dff6',
    'cod',
    8396, 
    'paid',
    CURRENT_TIMESTAMP
);

SELECT * FROM payments;
