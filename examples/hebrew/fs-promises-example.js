// 📂 File System Promises - Complete Example
// שרת Express מלא עם CRUD באמצעות קבצים

import fs from 'fs/promises';
import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// נתיבי קבצים
const DATA_DIR = './data';
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const LOGS_FILE = path.join(DATA_DIR, 'logs.txt');

// ===================================
// פונקציות עזר - File Operations
// ===================================

// וודא שתיקיית data קיימת
async function ensureDataDirectory() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log('✅ Data directory ready');
  } catch (err) {
    console.error('❌ Error creating data directory:', err);
  }
}

// קריאת משתמשים מקובץ
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    // אם הקובץ לא קיים, החזר מערך ריק ויצור את הקובץ
    if (err.code === 'ENOENT') {
      await writeUsers([]);
      return [];
    }
    throw err;
  }
}

// כתיבת משתמשים לקובץ
async function writeUsers(users) {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error('❌ Error writing users file:', err);
    throw err;
  }
}

// רישום פעולה ב-log
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

// יצירת backup של הקובץ
async function createBackup() {
  try {
    const backupFile = path.join(DATA_DIR, `users.backup.${Date.now()}.json`);
    const currentData = await fs.readFile(USERS_FILE, 'utf8');
    await fs.writeFile(backupFile, currentData, 'utf8');
    console.log(`✅ Backup created: ${backupFile}`);
    
    // מחק backups ישנים (שמור רק 5 אחרונים)
    await cleanOldBackups();
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('❌ Error creating backup:', err);
    }
  }
}

// ניקוי backups ישנים
async function cleanOldBackups() {
  try {
    const files = await fs.readdir(DATA_DIR);
    const backups = files
      .filter(f => f.startsWith('users.backup.'))
      .sort()
      .reverse();
    
    // שמור רק 5 backups אחרונים
    const toDelete = backups.slice(5);
    
    for (const backup of toDelete) {
      await fs.unlink(path.join(DATA_DIR, backup));
      console.log(`🗑️ Deleted old backup: ${backup}`);
    }
  } catch (err) {
    console.error('❌ Error cleaning backups:', err);
  }
}

// בדיקת גודל קובץ
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
  
  // המשך לבקשה הבאה
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

// דף הבית - מידע על ה-API
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

// GET - קבל את כל המשתמשים
app.get('/users', async (req, res) => {
  try {
    const users = await readUsers();
    
    // פילטרים אופציונליים
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

// GET - קבל משתמש ספציפי
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

// POST - צור משתמש חדש
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
    
    // קרא משתמשים קיימים
    const users = await readUsers();
    
    // בדוק אם האימייל כבר קיים
    if (users.find(u => u.email === email)) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }
    
    // צור משתמש חדש
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      age: age || null,
      city: city || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // הוסף לרשימה
    users.push(newUser);
    
    // שמור בקובץ
    await writeUsers(users);
    
    // רשום ב-log
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

// PUT - עדכן משתמש
app.put('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const updates = req.body;
    
    // קרא משתמשים
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // שמור את המשתמש הישן ל-log
    const oldUser = { ...users[userIndex] };
    
    // עדכן משתמש
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      id: userId, // שמור על ID מקורי
      createdAt: users[userIndex].createdAt, // שמור על תאריך יצירה
      updatedAt: new Date().toISOString()
    };
    
    // שמור בקובץ
    await writeUsers(users);
    
    // רשום ב-log
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

// PATCH - עדכן חלק מהמשתמש
app.patch('/users/:id', async (req, res) => {
  // זהה ל-PUT אבל יותר RESTful
  return app._router.handle(req, res);
});

// DELETE - מחק משתמש
app.delete('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // קרא משתמשים
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // שמור את המשתמש שנמחק
    const deletedUser = users[userIndex];
    
    // הסר מהרשימה
    users.splice(userIndex, 1);
    
    // שמור בקובץ
    await writeUsers(users);
    
    // רשום ב-log
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

// GET - סטטיסטיקות מערכת
app.get('/stats', async (req, res) => {
  try {
    const users = await readUsers();
    const fileSize = await getFileSize(USERS_FILE);
    const logSize = await getFileSize(LOGS_FILE);
    
    // קבצי backup
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

// POST - יצירת backup
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

// GET - הצג logs אחרונים
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
// Backup אוטומטי כל 5 דקות
// ===================================

setInterval(async () => {
  console.log('🔄 Creating automatic backup...');
  await createBackup();
}, 5 * 60 * 1000); // 5 דקות

// ===================================
// הפעלת השרת
// ===================================

async function startServer() {
  try {
    // וודא שתיקיית data קיימת
    await ensureDataDirectory();
    
    // רשום התחלת שרת
    await logAction('SERVER_STARTED');
    
    // הפעל שרת
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

// טיפול בסגירת השרת
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down gracefully...');
  await logAction('SERVER_STOPPED');
  process.exit(0);
});

// התחל את השרת
startServer();
