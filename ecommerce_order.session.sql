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

-- 