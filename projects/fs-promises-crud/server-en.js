// 📂 File System Promises CRUD Project
// Express server with persistent file storage

import fs from 'fs/promises';
import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// File paths
const DATA_DIR = './data';
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// ===================================
// Helper Functions - File Operations
// ===================================

// Ensure data directory exists
async function ensureDataDirectory() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Error creating data directory:', err);
  }
}

// Read users from file
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // File doesn't exist, create it
      await writeUsers([]);
      return [];
    }
    throw err;
  }
}

// Write users to file
async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// ===================================
// Home Page - API Information
// ===================================

app.get('/', async (req, res) => {
  try {
    const users = await readUsers();
    
    res.json({
      message: '📂 File System Promises CRUD API',
      description: 'CRUD project with file storage',
      features: [
        '💾 Persistent data storage',
        '📝 Formatted JSON files',
        '🔄 Asynchronous work with async/await'
      ],
      endpoints: {
        'GET /': 'API information',
        'GET /users': 'Get all users',
        'GET /users/:id': 'Get specific user',
        'POST /users': 'Create new user',
        'PUT /users/:id': 'Update user',
        'DELETE /users/:id': 'Delete user',
        'GET /stats': 'Statistics'
      },
      currentStats: {
        totalUsers: users.length,
        dataFile: USERS_FILE
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error reading data',
      details: err.message
    });
  }
});

// ===================================
// READ - Retrieve Data
// ===================================

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await readUsers();
    
    // Optional filters
    const { search, minAge, maxAge } = req.query;
    let filteredUsers = users;
    
    if (search) {
      filteredUsers = filteredUsers.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (minAge) {
      filteredUsers = filteredUsers.filter(u => u.age >= parseInt(minAge));
    }
    
    if (maxAge) {
      filteredUsers = filteredUsers.filter(u => u.age <= parseInt(maxAge));
    }
    
    res.json({
      success: true,
      count: filteredUsers.length,
      totalCount: users.length,
      users: filteredUsers
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error reading users',
      details: err.message
    });
  }
});

// Get specific user
app.get('/users/:id', async (req, res) => {
  try {
    const users = await readUsers();
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error reading user',
      details: err.message
    });
  }
});

// ===================================
// CREATE - Create New User
// ===================================

app.post('/users', async (req, res) => {
  try {
    const { name, email, age, city } = req.body;
    
    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required'
      });
    }
    
    if (age && (age < 0 || age > 150)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid age'
      });
    }
    
    // Read existing users
    const users = await readUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }
    
    // Create new user
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      age: age || null,
      city: city || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to list
    users.push(newUser);
    
    // Save to file
    await writeUsers(users);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: newUser
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error creating user',
      details: err.message
    });
  }
});

// ===================================
// UPDATE - Update User
// ===================================

app.put('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const updates = req.body;
    
    // Read users
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Update user
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      id: userId, // Keep original ID
      createdAt: users[userIndex].createdAt, // Keep creation date
      updatedAt: new Date().toISOString()
    };
    
    // Save to file
    await writeUsers(users);
    
    res.json({
      success: true,
      message: 'User updated successfully',
      user: users[userIndex]
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error updating user',
      details: err.message
    });
  }
});

// ===================================
// DELETE - Delete User
// ===================================

app.delete('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Read users
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Save deleted user
    const deletedUser = users[userIndex];
    
    // Remove from list
    users.splice(userIndex, 1);
    
    // Save to file
    await writeUsers(users);
    
    res.json({
      success: true,
      message: 'User deleted successfully',
      user: deletedUser
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error deleting user',
      details: err.message
    });
  }
});

// ===================================
// Statistics
// ===================================

app.get('/stats', async (req, res) => {
  try {
    const users = await readUsers();
    
    // Calculate statistics
    const stats = {
      totalUsers: users.length,
      averageAge: users.length > 0
        ? Math.round(users.reduce((sum, u) => sum + (u.age || 0), 0) / users.length)
        : 0,
      cities: [...new Set(users.map(u => u.city).filter(Boolean))],
      dataFile: USERS_FILE
    };
    
    res.json({
      success: true,
      stats
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error getting stats',
      details: err.message
    });
  }
});

// ===================================
// Start Server
// ===================================

async function startServer() {
  try {
    // Ensure data directory exists
    await ensureDataDirectory();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════╗
║  🚀 File System Promises Server is running!          ║
║  📍 URL: http://localhost:${PORT}                         ║
║  📂 Data directory: ${DATA_DIR}                          ║
║  📄 Users file: ${USERS_FILE}                 ║
╚════════════════════════════════════════════════════════╝

📖 Endpoints:
   GET    /              - API info
   GET    /users         - Get all users
   GET    /users/:id     - Get user by ID
   POST   /users         - Create user
   PUT    /users/:id     - Update user
   DELETE /users/:id     - Delete user
   GET    /stats         - Statistics

💾 Data is saved to: ${USERS_FILE}

🎯 Try: http://localhost:${PORT}
      `);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
