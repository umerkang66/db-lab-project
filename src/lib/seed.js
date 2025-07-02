const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config({ path: './.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initDb(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role VARCHAR(20) DEFAULT 'customer', -- admin
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS products (
      product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100),
      description TEXT,
      price DECIMAL(10, 2),
      stock_quantity INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(user_id),
      address text,
      status VARCHAR(20) DEFAULT 'unpaid', -- unpaid / paid
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      order_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id UUID REFERENCES orders(order_id),
      product_id UUID REFERENCES products(product_id),
      quantity INT
    );

    CREATE TABLE IF NOT EXISTS cart (
      cart_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(user_id),
      product_id UUID REFERENCES products(product_id),
      quantity INT
    );

    CREATE TABLE IF NOT EXISTS payments (
      payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id UUID REFERENCES orders(order_id), -- code / card
      payment_method VARCHAR(50),
      amount DECIMAL(10, 2),
      status VARCHAR(20), -- paid, pending, failed
      paid_at TIMESTAMP
    );  
  `);

  console.log('DONE.');
}

initDb(pool);
