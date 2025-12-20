import express from 'express';

const app = express();
const PORT = 3000;

// Middleware לקריאת JSON בבקשות
app.use(express.json());

// אחסון זמני בזיכרון (במקום מסד נתונים)
let users = [
  { id: 1, name: 'דוד כהן', email: 'david@example.com' },
  { id: 2, name: 'שרה לוי', email: 'sarah@example.com' }
];

let nextId = 3;

// בדיקת שרת פעיל
app.get('/', (req, res) => {
  res.json({ 
    message: 'ברוכים הבאים ל-CRUD API',
    endpoints: {
      'GET /users': 'קבלת כל המשתמשים',
      'GET /users/:id': 'קבלת משתמש ספציפי',
      'POST /users': 'יצירת משתמש חדש',
      'PUT /users/:id': 'עדכון משתמש קיים',
      'DELETE /users/:id': 'מחיקת משתמש'
    }
  });
});

// READ - קבלת כל המשתמשים
app.get('/users', (req, res) => {
  res.json({
    success: true,
    count: users.length,
    data: users
  });
});

// READ - קבלת משתמש ספציפי
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'משתמש לא נמצא'
    });
  }
  
  res.json({
    success: true,
    data: user
  });
});

// CREATE - יצירת משתמש חדש
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  
  // בדיקת תקינות
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'נא לספק שם ואימייל'
    });
  }
  
  const newUser = {
    id: nextId++,
    name,
    email
  };
  
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    message: 'משתמש נוצר בהצלחה',
    data: newUser
  });
});

// UPDATE - עדכון משתמש קיים
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'משתמש לא נמצא'
    });
  }
  
  // עדכון השדות שסופקו
  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;
  
  res.json({
    success: true,
    message: 'משתמש עודכן בהצלחה',
    data: users[userIndex]
  });
});

// DELETE - מחיקת משתמש
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'משתמש לא נמצא'
    });
  }
  
  const deletedUser = users[userIndex];
  users.splice(userIndex, 1);
  
  res.json({
    success: true,
    message: 'משתמש נמחק בהצלחה',
    data: deletedUser
  });
});

// הפעלת השרת
app.listen(PORT, () => {
  console.log(`🚀 השרת פועל על http://localhost:${PORT}`);
  console.log(`📚 לראות את כל ה-endpoints: http://localhost:${PORT}`);
});
