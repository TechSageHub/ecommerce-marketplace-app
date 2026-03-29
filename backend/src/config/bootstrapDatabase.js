const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const sampleProducts = [
  [
    "Minimalist Watch",
    89.99,
    "Accessories",
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80",
    18,
  ],
  [
    "Street Runner Sneakers",
    129.5,
    "Shoes",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    24,
  ],
  [
    "Signature Sunglasses",
    64,
    "Accessories",
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    12,
  ],
  [
    "Leather Travel Bag",
    149.99,
    "Bags",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    10,
  ],
  [
    "Oversized Hoodie",
    72,
    "Apparel",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    28,
  ],
  [
    "Wireless Earbuds",
    119,
    "Tech",
    "https://images.unsplash.com/photo-1585386959984-a41552231658?auto=format&fit=crop&w=800&q=80",
    30,
  ],
];

async function bootstrapDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
  });

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
    );

    await connection.query(`USE \`${process.env.DB_NAME}\``);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL DEFAULT 'Customer',
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'customer') NOT NULL DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    const [userNameColumns] = await connection.query(
      `SELECT COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ?
         AND TABLE_NAME = 'users'
         AND COLUMN_NAME = 'name'`,
      [process.env.DB_NAME]
    );

    if (userNameColumns.length === 0) {
      await connection.query(`
        ALTER TABLE users
        ADD COLUMN name VARCHAR(120) NOT NULL DEFAULT 'Customer'
        AFTER id
      `);
    }
    const [userRoleColumns] = await connection.query(
      `SELECT COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ?
         AND TABLE_NAME = 'users'
         AND COLUMN_NAME = 'role'`,
      [process.env.DB_NAME]
    );

    if (userRoleColumns.length === 0) {
      await connection.query(`
        ALTER TABLE users
        ADD COLUMN role ENUM('admin', 'customer') NOT NULL DEFAULT 'customer'
        AFTER password
      `);
    }

    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(120) NOT NULL,
        image TEXT NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_orders_user
          FOREIGN KEY (user_id) REFERENCES users(id)
          ON DELETE CASCADE
      )
    `);
    const [orderStatusColumns] = await connection.query(
      `SELECT COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ?
         AND TABLE_NAME = 'orders'
         AND COLUMN_NAME = 'status'`,
      [process.env.DB_NAME]
    );

    if (orderStatusColumns.length === 0) {
      await connection.query(`
        ALTER TABLE orders
        ADD COLUMN status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending'
        AFTER total_amount
      `);
    }

    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        CONSTRAINT fk_order_items_order
          FOREIGN KEY (order_id) REFERENCES orders(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_order_items_product
          FOREIGN KEY (product_id) REFERENCES products(id)
          ON DELETE CASCADE
      )
    `);

    const [rows] = await connection.query(
      "SELECT COUNT(*) AS count FROM products"
    );

    if (rows[0].count === 0) {
      await connection.query(
        "INSERT INTO products (name, price, category, image, stock) VALUES ?",
        [sampleProducts]
      );
    }
  } finally {
    await connection.end();
  }
}

module.exports = bootstrapDatabase;
