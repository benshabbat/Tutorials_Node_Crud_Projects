// 📂 פרויקט CRUD עם File System Promises
// שרת Express עם שמירת נתונים בקבצים

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

// ===================================
// פונקציות עזר - File Operations
// ===================================

// וודא שתיקיית data קיימת
async function ensureDataDirectory() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Error creating data directory:', err);
  }
}

// קריאת משתמשים מקובץ
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // הקובץ לא קיים, צור אותו
      await writeUsers([]);
      return [];
    }
    throw err;
  }
}

// כתיבת משתמשים לקובץ
async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// ===================================
// דף הבית - מידע על ה-API
// ===================================

app.get('/', async (req, res) => {
  try {
    const users = await readUsers();
    
    res.json({
      message: '📂 File System Promises CRUD API',
      description: 'פרויקט CRUD עם שמירה בקבצים',
      features: [
        '💾 שמירה קבועה של נתונים',
        '📝 קבצי JSON מעוצבים',
        '🔄 עבודה אסינכרונית עם async/await'
      ],
      endpoints: {
        'GET /': 'מידע על ה-API',
        'GET /users': 'קבל את כל המשתמשים',
        'GET /users/:id': 'קבל משתמש ספציפי',
        'POST /users': 'צור משתמש חדש',
        'PUT /users/:id': 'עדכן משתמש',
        'DELETE /users/:id': 'מחק משתמש',
        'GET /stats': 'סטטיסטיקות'
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
// READ - קריאת נתונים
// ===================================

// קבל את כל המשתמשים
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

// קבל משתמש ספציפי
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
// CREATE - יצירת משתמש חדש
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
// UPDATE - עדכון משתמש
// ===================================

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
// DELETE - מחיקת משתמש
// ===================================

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
// סטטיסטיקות
// ===================================

app.get('/stats', async (req, res) => {
  try {
    const users = await readUsers();
    
    // חשב סטטיסטיקות
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
// הפעלת השרת
// ===================================

async function startServer() {
  try {
    // וודא שתיקיית data קיימת
    await ensureDataDirectory();
    
    // הפעל שרת
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
