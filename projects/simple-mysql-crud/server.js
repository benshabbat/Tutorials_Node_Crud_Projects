// 📂 Simple MySQL CRUD - All in One File
// שרת Express פשוט עם MySQL - כל הקוד בקובץ אחד

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

// בדיקת חיבור
pool.getConnection()
  .then(connection => {
    console.log('✅ חיבור למסד נתונים הצליח!');
    connection.release();
  })
  .catch(err => {
    console.error('❌ שגיאה בחיבור למסד נתונים:', err.message);
    console.log('💡 וודא ש-MySQL רץ ושהגדרות החיבור ב-.env נכונות');
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
    console.log('✅ הטבלה users מוכנה');
  } catch (err) {
    console.error('❌ שגיאה ביצירת טבלה:', err.message);
  }
}

// הפעלת הגדרת מסד הנתונים
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
      'GET /api/users': 'קבל את כל המשתמשים',
      'GET /api/users/:id': 'קבל משתמש לפי ID',
      'POST /api/users': 'צור משתמש חדש (body: name, email, age)',
      'PUT /api/users/:id': 'עדכן משתמש',
      'DELETE /api/users/:id': 'מחק משתמש',
      'GET /api/stats': 'סטטיסטיקות מסד הנתונים'
    }
  });
});

// 📊 GET /api/stats - סטטיסטיקות
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
    console.error('שגיאה בקבלת סטטיסטיקות:', err);
    res.status(500).json({ error: 'שגיאה בשרת' });
  }
});

// 📖 GET /api/users - קבלת כל המשתמשים
app.get('/api/users', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    console.error('שגיאה בקבלת משתמשים:', err);
    res.status(500).json({ 
      success: false,
      error: 'שגיאה בשרת' 
    });
  }
});

// 📖 GET /api/users/:id - קבלת משתמש לפי ID
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
        error: 'משתמש לא נמצא' 
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (err) {
    console.error('שגיאה בקבלת משתמש:', err);
    res.status(500).json({ 
      success: false,
      error: 'שגיאה בשרת' 
    });
  }
});

// ➕ POST /api/users - הוספת משתמש חדש
app.post('/api/users', async (req, res) => {
  const { name, email, age } = req.body;

  // ולידציה בסיסית
  if (!name || !email) {
    return res.status(400).json({ 
      success: false,
      error: 'שם ואימייל הם שדות חובה' 
    });
  }

  // בדיקת אימייל תקין
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      error: 'אימייל לא תקין' 
    });
  }

  // בדיקת גיל תקין
  if (age && (age < 0 || age > 150)) {
    return res.status(400).json({ 
      success: false,
      error: 'גיל לא תקין' 
    });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
      [name, email, age || null]
    );

    // קבלת המשתמש שנוצר
    const [newUser] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'משתמש נוסף בהצלחה',
      data: newUser[0]
    });
  } catch (err) {
    console.error('שגיאה בהוספת משתמש:', err);
    
    // טיפול בשגיאת אימייל כפול
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success: false,
        error: 'אימייל כבר קיים במערכת' 
      });
    }

    res.status(500).json({ 
      success: false,
      error: 'שגיאה בשרת' 
    });
  }
});

// ✏️ PUT /api/users/:id - עדכון משתמש
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  // ולידציה בסיסית
  if (!name || !email) {
    return res.status(400).json({ 
      success: false,
      error: 'שם ואימייל הם שדות חובה' 
    });
  }

  // בדיקת אימייל תקין
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      error: 'אימייל לא תקין' 
    });
  }

  // בדיקת גיל תקין
  if (age && (age < 0 || age > 150)) {
    return res.status(400).json({ 
      success: false,
      error: 'גיל לא תקין' 
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
        error: 'משתמש לא נמצא' 
      });
    }

    // קבלת המשתמש המעודכן
    const [updatedUser] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'משתמש עודכן בהצלחה',
      data: updatedUser[0]
    });
  } catch (err) {
    console.error('שגיאה בעדכון משתמש:', err);

    // טיפול בשגיאת אימייל כפול
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success: false,
        error: 'אימייל כבר קיים במערכת' 
      });
    }

    res.status(500).json({ 
      success: false,
      error: 'שגיאה בשרת' 
    });
  }
});

// 🗑️ DELETE /api/users/:id - מחיקת משתמש
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // קבלת המשתמש לפני המחיקה
    const [users] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'משתמש לא נמצא' 
      });
    }

    const deletedUser = users[0];

    // מחיקת המשתמש
    await pool.query('DELETE FROM users WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'משתמש נמחק בהצלחה',
      data: deletedUser
    });
  } catch (err) {
    console.error('שגיאה במחיקת משתמש:', err);
    res.status(500).json({ 
      success: false,
      error: 'שגיאה בשרת' 
    });
  }
});

// ===================================
// 404 Handler
// ===================================
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'נתיב לא נמצא' 
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
