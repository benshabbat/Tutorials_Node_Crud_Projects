// Database Configuration and Connection Pool
// Database connection management file

import mysql from 'mysql2/promise';
import 'dotenv/config';

// Create Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Connected to database successfully!');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection error:', err.message);
    console.log('💡 Make sure MySQL is running and .env settings are correct');
  });

// Create tables
async function setupDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        age INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table is ready');
  } catch (err) {
    console.error('❌ Error creating table:', err.message);
  }
}

// Initialize database setup
setupDatabase();

export default pool;
