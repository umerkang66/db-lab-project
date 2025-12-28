const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config({ path: './.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Sample products data
const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description:
      'Premium noise-cancelling wireless headphones with 30-hour battery life and crystal-clear audio quality.',
    price: 4999.99,
    stock_quantity: 50,
  },
  {
    name: 'Smart Watch Pro',
    description:
      'Advanced fitness tracking smartwatch with heart rate monitor, GPS, and water resistance up to 50m.',
    price: 12999.99,
    stock_quantity: 35,
  },
  {
    name: 'Portable Power Bank 20000mAh',
    description:
      'High-capacity portable charger with fast charging support for all your devices.',
    price: 2499.99,
    stock_quantity: 100,
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description:
      'RGB backlit mechanical keyboard with Cherry MX switches and programmable keys.',
    price: 7999.99,
    stock_quantity: 25,
  },
  {
    name: 'Wireless Gaming Mouse',
    description:
      'Ultra-lightweight wireless mouse with 25K DPI sensor and 70-hour battery life.',
    price: 3999.99,
    stock_quantity: 40,
  },
  {
    name: 'USB-C Hub 7-in-1',
    description:
      'Multi-port USB-C adapter with HDMI, USB 3.0, SD card reader, and power delivery.',
    price: 1999.99,
    stock_quantity: 75,
  },
  {
    name: 'Laptop Stand Adjustable',
    description:
      'Ergonomic aluminum laptop stand with adjustable height and angle for comfortable viewing.',
    price: 1499.99,
    stock_quantity: 60,
  },
  {
    name: 'Webcam 4K Ultra HD',
    description:
      'Professional 4K webcam with auto-focus, built-in microphone, and privacy cover.',
    price: 5999.99,
    stock_quantity: 30,
  },
  {
    name: 'Wireless Earbuds',
    description:
      'True wireless earbuds with active noise cancellation and 24-hour total battery life.',
    price: 6499.99,
    stock_quantity: 45,
  },
  {
    name: 'Smart LED Desk Lamp',
    description:
      'Touch-controlled LED lamp with adjustable brightness, color temperature, and USB charging port.',
    price: 2999.99,
    stock_quantity: 55,
  },
  {
    name: 'Bluetooth Speaker',
    description:
      'Portable waterproof Bluetooth speaker with 360-degree sound and 12-hour playtime.',
    price: 3499.99,
    stock_quantity: 65,
  },
  {
    name: 'Gaming Controller',
    description:
      'Wireless gaming controller compatible with PC, PlayStation, and mobile devices.',
    price: 4499.99,
    stock_quantity: 20,
  },
  {
    name: 'External SSD 1TB',
    description:
      'Ultra-fast portable SSD with USB 3.2 Gen 2 and read speeds up to 1050MB/s.',
    price: 8999.99,
    stock_quantity: 15,
  },
  {
    name: 'Noise Cancelling Microphone',
    description:
      'USB condenser microphone with noise cancellation, perfect for streaming and podcasts.',
    price: 4999.99,
    stock_quantity: 28,
  },
  {
    name: 'Tablet Stand Holder',
    description:
      'Universal tablet and phone stand with 360-degree rotation and adjustable arm.',
    price: 999.99,
    stock_quantity: 80,
  },
];

// Sample users data
const users = [
  {
    name: 'Admin User',
    email: 'admin@shophub.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'customer',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'customer',
  },
];

async function seedDatabase() {
  const client = await pool.connect();

  try {
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await client.query('DELETE FROM payments');
    await client.query('DELETE FROM order_items');
    await client.query('DELETE FROM orders');
    await client.query('DELETE FROM cart');
    await client.query('DELETE FROM products');
    await client.query('DELETE FROM users');
    console.log('✅ Existing data cleared\n');

    // Seed users
    console.log('👤 Seeding users...');
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await client.query(
        `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)`,
        [user.name, user.email, hashedPassword, user.role]
      );
      console.log(`   ✓ Created user: ${user.email} (${user.role})`);
    }
    console.log(`✅ ${users.length} users seeded\n`);

    // Seed products
    console.log('📦 Seeding products...');
    for (const product of products) {
      await client.query(
        `INSERT INTO products (name, description, price, stock_quantity) VALUES ($1, $2, $3, $4)`,
        [
          product.name,
          product.description,
          product.price,
          product.stock_quantity,
        ]
      );
      console.log(`   ✓ Created product: ${product.name}`);
    }
    console.log(`✅ ${products.length} products seeded\n`);

    console.log('🎉 Database seeding completed successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Admin Login:');
    console.log('   Email: admin@shophub.com');
    console.log('   Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Customer Login:');
    console.log('   Email: john@example.com');
    console.log('   Password: password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();
