// 📂 Simple MySQL CRUD - All in One File
// Simple Express server with MySQL - all code in one file

import express from 'express';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// ===================================
// Database Connection Pool
// ===================================

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

// ===================================
// Database Setup
// ===================================

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

// ===================================
// Routes
// ===================================

// 🏠 Welcome Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Simple MySQL CRUD API',
    version: '1.0.0',
    database: 'MySQL',
    endpoints: {
      users: '/api/users',
      stats: '/api/stats'
    },
    documentation: {
      'GET /api/users': 'Get all users',
      'GET /api/users/:id': 'Get user by ID',
      'POST /api/users': 'Create new user (body: name, email, age)',
      'PUT /api/users/:id': 'Update user',
      'DELETE /api/users/:id': 'Delete user',
      'GET /api/stats': 'Database statistics'
    }
  });
});

// 📊 GET /api/stats - Statistics
app.get('/api/stats', async (req, res) => {
  try {
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM users');
    const [avgResult] = await pool.query('SELECT AVG(age) as avgAge FROM users');
    const [minMaxResult] = await pool.query(
      'SELECT MIN(age) as minAge, MAX(age) as maxAge FROM users'
    );

    res.json({
      totalUsers: countResult[0].total,
      averageAge: avgResult[0].avgAge ? Math.round(avgResult[0].avgAge) : null,
      minAge: minMaxResult[0].minAge,
      maxAge: minMaxResult[0].maxAge
    });
  } catch (err) {
    console.error('Error getting statistics:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 📖 GET /api/users - Get all users
app.get('/api/users', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    console.error('Error getting users:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

// 📖 GET /api/users/:id - Get user by ID
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [users] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (err) {
    console.error('Error getting user:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

// ➕ POST /api/users - Create new user
app.post('/api/users', async (req, res) => {
  const { name, email, age } = req.body;

  // Basic validation
  if (!name || !email) {
    return res.status(400).json({ 
      success: false,
      error: 'Name and email are required' 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid email format' 
    });
  }

  // Validate age
  if (age && (age < 0 || age > 150)) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid age' 
    });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
      [name, email, age || null]
    );

    // Get created user
    const [newUser] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser[0]
    });
  } catch (err) {
    console.error('Error creating user:', err);
    
    // Handle duplicate email error
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success: false,
        error: 'Email already exists' 
      });
    }

    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

// ✏️ PUT /api/users/:id - Update user
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  // Basic validation
  if (!name || !email) {
    return res.status(400).json({ 
      success: false,
      error: 'Name and email are required' 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid email format' 
    });
  }

  // Validate age
  if (age && (age < 0 || age > 150)) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid age' 
    });
  }

  try {
    const [result] = await pool.query(
      'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
      [name, email, age || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    // Get updated user
    const [updatedUser] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser[0]
    });
  } catch (err) {
    console.error('Error updating user:', err);

    // Handle duplicate email error
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success: false,
        error: 'Email already exists' 
      });
    }

    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

// 🗑️ DELETE /api/users/:id - Delete user
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Get user before deletion
    const [users] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    const deletedUser = users[0];

    // Delete user
    await pool.query('DELETE FROM users WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

// ===================================
// 404 Handler
// ===================================
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found' 
  });
});

// ===================================
// Start Server
// ===================================
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 Simple MySQL CRUD Server is running');
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📚 API: http://localhost:${PORT}/api/users`);
  console.log(`💾 Database: MySQL`);
  console.log('='.repeat(50));
});
