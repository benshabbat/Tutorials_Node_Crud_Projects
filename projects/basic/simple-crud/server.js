// 🎯 פרויקט CRUD פשוט למתחילים
// שרת Express בסיסי עם מערך פשוט לאחסון נתונים

import express from 'express';

const app = express();
const PORT = 3000;

// Middleware - מאפשר לקרוא JSON בבקשות
app.use(express.json());

// 📊 מאגר נתונים פשוט (מערך)
let users = [
  { id: 1, name: 'יוסי כהן', email: 'yossi@example.com', age: 28 },
  { id: 2, name: 'שרה לוי', email: 'sara@example.com', age: 32 },
  { id: 3, name: 'דוד מזרחי', email: 'david@example.com', age: 25 }
];

// ===================================
// דף הבית - מידע על ה-API
// ===================================

app.get('/', (req, res) => {
  res.json({
    message: '👋 ברוכים הבאים ל-API הפשוט שלי!',
    description: 'פרויקט CRUD בסיסי למתחילים',
    endpoints: {
      'GET /': 'מידע על ה-API',
      'GET /users': 'קבל את כל המשתמשים',
      'GET /users/:id': 'קבל משתמש ספציפי',
      'POST /users': 'צור משתמש חדש',
      'PUT /users/:id': 'עדכן משתמש',
      'DELETE /users/:id': 'מחק משתמש'
    },
    currentUsers: users.length
  });
});

// ===================================
// READ - קריאת נתונים
// ===================================

// קבל את כל המשתמשים
app.get('/users', (req, res) => {
  res.json({
    success: true,
    count: users.length,
    users: users
  });
});

// קבל משתמש ספציפי לפי ID
app.get('/users/:id', (req, res) => {
  // המר את ה-ID ממחרוזת למספר
  const userId = parseInt(req.params.id);
  
  // חפש את המשתמש במערך
  const user = users.find(u => u.id === userId);
  
  // אם לא נמצא, החזר שגיאה
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'משתמש לא נמצא'
    });
  }
  
  // החזר את המשתמש
  res.json({
    success: true,
    user: user
  });
});

// ===================================
// CREATE - יצירת משתמש חדש
// ===================================

app.post('/users', (req, res) => {
  // קבל את הנתונים מגוף הבקשה
  const { name, email, age } = req.body;
  
  // בדיקות בסיסיות
  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'שם הוא שדה חובה'
    });
  }
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'אימייל הוא שדה חובה'
    });
  }
  
  // בדוק אם האימייל כבר קיים
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'אימייל זה כבר קיים במערכת'
    });
  }
  
  // צור משתמש חדש
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name: name,
    email: email,
    age: age || null
  };
  
  // הוסף למערך
  users.push(newUser);
  
  // החזר תשובה מוצלחת
  res.status(201).json({
    success: true,
    message: 'משתמש נוצר בהצלחה!',
    user: newUser
  });
});

// ===================================
// UPDATE - עדכון משתמש
// ===================================

app.put('/users/:id', (req, res) => {
  // קבל את ה-ID
  const userId = parseInt(req.params.id);
  
  // מצא את המשתמש
  const userIndex = users.findIndex(u => u.id === userId);
  
  // אם לא נמצא
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'משתמש לא נמצא'
    });
  }
  
  // קבל את העדכונים
  const { name, email, age } = req.body;
  
  // עדכן את המשתמש
  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;
  if (age !== undefined) users[userIndex].age = age;
  
  // החזר את המשתמש המעודכן
  res.json({
    success: true,
    message: 'משתמש עודכן בהצלחה!',
    user: users[userIndex]
  });
});

// ===================================
// DELETE - מחיקת משתמש
// ===================================

app.delete('/users/:id', (req, res) => {
  // קבל את ה-ID
  const userId = parseInt(req.params.id);
  
  // מצא את המשתמש
  const userIndex = users.findIndex(u => u.id === userId);
  
  // אם לא נמצא
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'משתמש לא נמצא'
    });
  }
  
  // שמור את המשתמש שנמחק
  const deletedUser = users[userIndex];
  
  // הסר מהמערך
  users.splice(userIndex, 1);
  
  // החזר תשובה
  res.json({
    success: true,
    message: 'משתמש נמחק בהצלחה!',
    user: deletedUser
  });
});

// ===================================
// הפעלת השרת
// ===================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🚀 השרת רץ!                         ║
║  📍 כתובת: http://localhost:${PORT}     ║
║  👥 משתמשים נוכחיים: ${users.length}              ║
╚════════════════════════════════════════╝

💡 טיפ: פתח את הדפדפן ב-http://localhost:${PORT}
  `);
});
