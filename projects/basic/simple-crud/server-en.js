// 🎯 Simple CRUD Project - For Absolute Beginners
// Express server with in-memory storage (Array)

import express from 'express';

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// In-memory database - simple array
let users = [];

// ===================================
// Home Page - API Information
// ===================================

app.get('/', (req, res) => {
  res.json({
    message: '🎯 Welcome to Simple CRUD API!',
    description: 'Basic CRUD project for beginners',
    features: [
      '✅ Simple and easy to understand',
      '✅ No database required',
      '✅ Perfect for learning'
    ],
    endpoints: {
      'GET /': 'API information',
      'GET /users': 'Get all users',
      'GET /users/:id': 'Get specific user',
      'POST /users': 'Create new user',
      'PUT /users/:id': 'Update user',
      'DELETE /users/:id': 'Delete user'
    },
    currentStats: {
      totalUsers: users.length
    }
  });
});

// ===================================
// READ - Get Data
// ===================================

// Get all users
app.get('/users', (req, res) => {
  res.json({
    success: true,
    count: users.length,
    users: users
  });
});

// Get specific user by ID
app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  res.json({
    success: true,
    user: user
  });
});

// ===================================
// CREATE - Create New User
// ===================================

app.post('/users', (req, res) => {
  const { name, email } = req.body;
  
  // Validation - check required fields
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: 'Name and email are required'
    });
  }
  
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
    name: name,
    email: email
  };
  
  // Add to array
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    user: newUser
  });
});

// ===================================
// UPDATE - Update User
// ===================================

app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email } = req.body;
  
  // Find user
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  // Update user data
  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;
  
  res.json({
    success: true,
    message: 'User updated successfully',
    user: users[userIndex]
  });
});

// ===================================
// DELETE - Delete User
// ===================================

app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  
  // Find user
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  // Remove from array
  const deletedUser = users[userIndex];
  users.splice(userIndex, 1);
  
  res.json({
    success: true,
    message: 'User deleted successfully',
    user: deletedUser
  });
});

// ===================================
// Start Server
// ===================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║  🚀 Simple CRUD Server is running!               ║
║  📍 URL: http://localhost:${PORT}                    ║
╚════════════════════════════════════════════════════╝

📖 Endpoints:
   GET    /              - API info
   GET    /users         - Get all users
   GET    /users/:id     - Get user by ID
   POST   /users         - Create user
   PUT    /users/:id     - Update user
   DELETE /users/:id     - Delete user

⚠️  Note: Data is stored in memory only!
    When you stop the server, all data will be lost.

🎯 Try: http://localhost:${PORT}
  `);
});
