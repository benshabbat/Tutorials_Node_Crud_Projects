// 📂 File System Promises - Complete Example
// Full Express server with CRUD using files

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
const LOGS_FILE = path.join(DATA_DIR, 'logs.txt');

// ===================================
// Helper Functions - File Operations
// ===================================

// Ensure data directory exists
async function ensureDataDirectory() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log('✅ Data directory ready');
  } catch (err) {
    console.error('❌ Error creating data directory:', err);
  }
}

// Read users from file
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    // If file doesn't exist, return empty array and create the file
    if (err.code === 'ENOENT') {
      await writeUsers([]);
      return [];
    }
    throw err;
  }
}

// Write users to file
async function writeUsers(users) {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error('❌ Error writing users file:', err);
    throw err;
  }
}

// Log action to log file
async function logAction(action, details = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    ...details
  };
  
  const logLine = `${JSON.stringify(logEntry)}\n`;
  
  try {
    await fs.appendFile(LOGS_FILE, logLine, 'utf8');
  } catch (err) {
    console.error('❌ Error writing to log:', err);
  }
}

// Create backup of file
async function createBackup() {
  try {
    const backupFile = path.join(DATA_DIR, `users.backup.${Date.now()}.json`);
    const currentData = await fs.readFile(USERS_FILE, 'utf8');
    await fs.writeFile(backupFile, currentData, 'utf8');
    console.log(`✅ Backup created: ${backupFile}`);
    
    // Delete old backups (keep only last 5)
    await cleanOldBackups();
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('❌ Error creating backup:', err);
    }
  }
}

// Clean old backups
async function cleanOldBackups() {
  try {
    const files = await fs.readdir(DATA_DIR);
    const backups = files
      .filter(f => f.startsWith('users.backup.'))
      .sort()
      .reverse();
    
    // Keep only last 5 backups
    const toDelete = backups.slice(5);
    
    for (const backup of toDelete) {
      await fs.unlink(path.join(DATA_DIR, backup));
      console.log(`🗑️ Deleted old backup: ${backup}`);
    }
  } catch (err) {
    console.error('❌ Error cleaning backups:', err);
  }
}

// Check file size
async function getFileSize(filepath) {
  try {
    const stats = await fs.stat(filepath);
    return stats.size;
  } catch {
    return 0;
  }
}

// ===================================
// Middleware - Logging
// ===================================

app.use(async (req, res, next) => {
  const start = Date.now();
  
  // Continue to next request
  res.on('finish', async () => {
    const duration = Date.now() - start;
    await logAction('HTTP_REQUEST', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });
  
  next();
});

// ===================================
// API Endpoints - CRUD
// ===================================

// Homepage - API information
app.get('/', async (req, res) => {
  const fileSize = await getFileSize(USERS_FILE);
  const users = await readUsers();
  
  res.json({
    message: '📂 File System Promises API',
    version: '1.0.0',
    endpoints: {
      users: {
        'GET /users': 'Get all users',
        'GET /users/:id': 'Get user by ID',
        'POST /users': 'Create new user',
        'PUT /users/:id': 'Update user',
        'DELETE /users/:id': 'Delete user'
      },
      system: {
        'GET /stats': 'Get system statistics',
        'POST /backup': 'Create backup',
        'GET /logs': 'View recent logs'
      }
    },
    currentStats: {
      totalUsers: users.length,
      dataFileSize: `${fileSize} bytes`,
      dataFile: USERS_FILE
    }
  });
});

// ===================================
// CRUD - Users
// ===================================

// GET - Get all users
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

// GET - Get specific user
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

// POST - Create new user
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
    
    // Log action
    await logAction('USER_CREATED', {
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email
    });
    
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

// PUT - Update user
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
    
    // Save old user for log
    const oldUser = { ...users[userIndex] };
    
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
    
    // Log action
    await logAction('USER_UPDATED', {
      userId,
      changes: updates
    });
    
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

// PATCH - Partial user update
app.patch('/users/:id', async (req, res) => {
  // Same as PUT but more RESTful
  return app._router.handle(req, res);
});

// DELETE - Delete user
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
    
    // Log action
    await logAction('USER_DELETED', {
      userId,
      name: deletedUser.name,
      email: deletedUser.email
    });
    
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
// System Endpoints
// ===================================

// GET - System statistics
app.get('/stats', async (req, res) => {
  try {
    const users = await readUsers();
    const fileSize = await getFileSize(USERS_FILE);
    const logSize = await getFileSize(LOGS_FILE);
    
    // Backup files
    const files = await fs.readdir(DATA_DIR);
    const backups = files.filter(f => f.startsWith('users.backup.'));
    
    res.json({
      success: true,
      stats: {
        users: {
          total: users.length,
          averageAge: users.length > 0
            ? Math.round(users.reduce((sum, u) => sum + (u.age || 0), 0) / users.length)
            : 0
        },
        files: {
          dataFile: {
            path: USERS_FILE,
            size: `${fileSize} bytes`,
            exists: fileSize > 0
          },
          logFile: {
            path: LOGS_FILE,
            size: `${logSize} bytes`
          }
        },
        backups: {
          count: backups.length,
          files: backups
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error getting stats',
      details: err.message
    });
  }
});

// POST - Create backup
app.post('/backup', async (req, res) => {
  try {
    await createBackup();
    
    res.json({
      success: true,
      message: 'Backup created successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error creating backup',
      details: err.message
    });
  }
});

// GET - View recent logs
app.get('/logs', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    
    const logs = await fs.readFile(LOGS_FILE, 'utf8');
    const lines = logs.trim().split('\n');
    const recentLogs = lines.slice(-limit).reverse();
    
    const parsedLogs = recentLogs.map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return { raw: line };
      }
    });
    
    res.json({
      success: true,
      count: parsedLogs.length,
      logs: parsedLogs
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error reading logs',
      details: err.message
    });
  }
});

// ===================================
// Automatic backup every 5 minutes
// ===================================

setInterval(async () => {
  console.log('🔄 Creating automatic backup...');
  await createBackup();
}, 5 * 60 * 1000); // 5 minutes

// ===================================
// Start Server
// ===================================

async function startServer() {
  try {
    // Ensure data directory exists
    await ensureDataDirectory();
    
    // Log server start
    await logAction('SERVER_STARTED');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════╗
║  🚀 File System Promises Server is running!          ║
║  📍 URL: http://localhost:${PORT}                         ║
║  📂 Data directory: ${DATA_DIR}                          ║
║  📄 Users file: ${USERS_FILE}                 ║
║  📝 Logs file: ${LOGS_FILE}                  ║
║  💾 Auto-backup: Every 5 minutes                      ║
╚════════════════════════════════════════════════════════╝

📖 Available endpoints:
   GET    /              - API info
   GET    /users         - Get all users
   GET    /users/:id     - Get user by ID
   POST   /users         - Create user
   PUT    /users/:id     - Update user
   DELETE /users/:id     - Delete user
   GET    /stats         - System stats
   POST   /backup        - Create backup
   GET    /logs          - View logs

🎯 Try: http://localhost:${PORT}
      `);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down gracefully...');
  await logAction('SERVER_STOPPED');
  process.exit(0);
});

// Start the server
startServer();
