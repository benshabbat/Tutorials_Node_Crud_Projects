# תרגיל - CRUD עם MySQL למתחילים
## ניהול רשימת משימות (Tasks) עם בסיס נתונים MySQL

## מבוא

בתרגיל זה תלמדו לבנות API מלא עם Express ו-MySQL מאפס!  
במקום לשמור נתונים בקבצי JSON, נשתמש במסד נתונים אמיתי.

**מה תלמדו:**
- ✅ חיבור ל-MySQL מתוך Node.js
- ✅ יצירת טבלאות באופן אוטומטי
- ✅ פעולות CRUD (Create, Read, Update, Delete)
- ✅ שאילתות SQL עם Parameters מוגנים
- ✅ טיפול בשגיאות של בסיס נתונים
- ✅ עבודה עם חיבור יחיד למסד נתונים
- ✅ מבנה מודולרי עם MVC (בתרגיל מתקדם)

**שני חלקים בתרגיל:**
1. **חלק א'**: קובץ יחיד פשוט (למתחילים)
2. **חלק ב'**: מבנה מודולרי (MVC - למתקדמים יותר)

---

## חלק א': קובץ יחיד פשוט (Simple CRUD)

בחלק זה נבנה את כל האפליקציה בקובץ אחד - זה הדרך הטובה ביותר להתחיל!

---

## הגדרות התחלתיות

### 1. וודאו ש-MySQL מותקן ופועל

אם עדיין לא התקנתם MySQL, עברו למדריך [mysql-docker-guide.md](guides/hebrew/mysql-docker-guide.md) או [mysql-guide.md](guides/hebrew/mysql-guide.md)

**בדיקה מהירה שהכל עובד:**
```bash
mysql -u root -p
# הקלידו את הסיסמה שהגדרתם
```

### 2. יצירת פרויקט חדש

```bash
mkdir express-mysql-tasks
cd express-mysql-tasks
npm init -y
npm install express mysql2 dotenv
npm install -D nodemon
```

### 3. אוסיפו ל-package.json

```json
{
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 4. צרו קובץ .env

**⚠️ חשוב: הקובץ הזה מכיל מידע רגיש - אל תעלו אותו ל-Git!**

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=tasks_db
DB_PORT=3306
PORT=3000
```

**החליפו את `your_mysql_password` בסיסמה האמיתית שלכם!**

### 5. צרו .gitignore

```
node_modules/
.env
```

---

## חלק א': בניית החיבור למסד נתונים

### שלב 1: קוד בסיסי

צרו קובץ `server.js`:

```javascript
import express from 'express';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware לקריאת JSON
app.use(express.json());

// TODO: כאן ניצור את החיבור למסד הנתונים


// נתחיל את השרת
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
```

### שלב 2: יצירת חיבור למסד הנתונים

**מה זה Connection?**  
ניצור חיבור יחיד למסד הנתונים שישמש אותנו לכל השאילתות. זה הכי פשוט למתחילים!

**הוסיפו אחרי app.use(express.json()):**

```javascript
// ===================================
// Database Connection
// ===================================

// TODO: Create connection with mysql.createConnection
// TODO: Print success message
// TODO: Add connection cleanup handler (process.on('SIGINT'))
```

**רמז:** השתמשו ב-`await mysql.createConnection({...})`
```

### שלב 3: בדיקה ראשונה

**הריצו:**
```bash
npm run dev
```

**אם הכל תקין תראו:**
```
🚀 Server is running on http://localhost:3000
✅ מחובר למסד הנתונים בהצלחה!
```

**⚠️ אם יש שגיאה:**
- `Access denied` - סיסמה לא נכונה ב-.env
- `Unknown database` - המסד לא קיים (ניצור אותו בשלב הבא)
- `ECONNREFUSED` - MySQL לא פועל

---

## חלק ב': יצירת מסד הנתונים והטבלה

### שלב 1: יצירת Database

**פתחו terminal נוסף והריצו:**

```bash
mysql -u root -p
```

**ב-MySQL shell הקלידו:**

```sql
CREATE DATABASE IF NOT EXISTS tasks_db;
USE tasks_db;
SHOW DATABASES;
EXIT;
```

### שלב 2: פונקציה ליצירת טבלה אוטומטית

**הוסיפו לפני app.listen():**

```javascript
// ===================================
// הגדרת מבנה הטבלה
// ===================================

async function setupDatabase() {
  try {
    // TODO: Write CREATE TABLE IF NOT EXISTS query
    // TODO: Create a table named tasks with the following fields:
    //   - id (INT AUTO_INCREMENT PRIMARY KEY)
    //   - title (VARCHAR(200) NOT NULL)
    //   - description (TEXT)
    //   - status (ENUM with pending, in_progress, completed)
    //   - priority (ENUM with low, medium, high)
    //   - created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
    //   - updated_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
    
    console.log('✅ Tasks table is ready');
  } catch (err) {
    console.error('❌ Error creating table:', err.message);
  }
}

// הפעלת הפונקציה בזמן התחלת השרת
setupDatabase();
```

### שלב 3: בדיקה שהטבלה נוצרה

**הריצו מחדש את השרת (Ctrl+C ואז npm run dev)**

אמורים לראות:
```
✅ מחובר למסד הנתונים בהצלחה!
✅ טבלת tasks מוכנה לשימוש
```

**אפשר גם לבדוק ישירות ב-MySQL:**

```bash
mysql -u root -p tasks_db
```

```sql
SHOW TABLES;
DESCRIBE tasks;
```

---

## חלק ג': בניית Routes - GET כל המשימות

### שלב 1: Route בסיסי

**הוסיפו אחרי setupDatabase() ולפני app.listen():**

```javascript
// ===================================
// Routes
// ===================================

// 🏠 בדיקת שרת
app.get('/', (req, res) => {
  res.json({
    message: 'שלום! ברוכים הבאים ל-API של ניהול משימות',
    endpoints: {
      'GET /api/tasks': 'קבלת כל המשימות',
      'GET /api/tasks/:id': 'קבלת משימה לפי ID',
      'POST /api/tasks': 'יצירת משימה חדשה',
      'PUT /api/tasks/:id': 'עדכון משימה',
      'DELETE /api/tasks/:id': 'מחיקת משימה'
    }
  });
});

// TODO: כאן נוסיף את כל ה-Routes
```

### שלב 2: GET /api/tasks - קבלת כל המשימות

**הוסיפו:**

```javascript
// 📋 GET /api/tasks - Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    // TODO: Write SQL query to get all tasks
    // TODO: Sort results by created_at in descending order
    // Hint: SELECT * FROM tasks ORDER BY ... DESC
    
    const tasks = []; // Replace with actual query
    
    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    console.error('שגיאה בקבלת משימות:', err);
    res.status(500).json({
      success: false,
      message: 'שגיאה בקבלת משימות',
      error: err.message
    });
  }
});
```

### שלב 3: בדיקה ב-Browser או Thunder Client

**פתחו דפדפן:**  
http://localhost:3000/api/tasks

**תקבלו:**
```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

עדיין אין משימות - זה בסדר! בשלב הבא נוסיף.

---

## חלק ד': POST - יצירת משימה חדשה

### שלב 1: Route ליצירת משימה

**הוסיפו אחרי GET /api/tasks:**

```javascript
// ➕ POST /api/tasks - Create new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    
    // Validation - ensure title exists
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    // TODO: Write INSERT query
    // Hint: INSERT INTO tasks (title, description, status, priority) VALUES (?, ?, ?, ?)
    // TODO: Use Prepared Statements with ? for values
    // TODO: Don't forget to handle null if there's no description
    
    // TODO: Get the newly created task
    // Hint: Use result.insertId

    res.status(201).json({
      success: true,
      message: 'המשימה נוצרה בהצלחה!',
      data: newTask[0]
    });
  } catch (err) {
    console.error('שגיאה ביצירת משימה:', err);
    res.status(500).json({
      success: false,
      message: 'שגיאה ביצירת משימה',
      error: err.message
    });
  }
});
```

### שלב 2: בדיקה עם Thunder Client / Postman

**Request:**
- Method: `POST`
- URL: `http://localhost:3000/api/tasks`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "title": "ללמוד MySQL",
  "description": "להתאמן על שאילתות ו-CRUD",
  "status": "in_progress",
  "priority": "high"
}
```

**Response:**
```json
{
  "success": true,
  "message": "המשימה נוצרה בהצלחה!",
  "data": {
    "id": 1,
    "title": "ללמוד MySQL",
    "description": "להתאמן על שאילתות ו-CRUD",
    "status": "in_progress",
    "priority": "high",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### שלב 3: נסו ליצור עוד משימות

```json
{
  "title": "לסיים פרויקט Node.js",
  "priority": "high"
}
```

```json
{
  "title": "לקנות חלב",
  "status": "pending",
  "priority": "low"
}
```

**עכשיו נסו שוב GET /api/tasks - תראו את כל המשימות!**

---

## חלק ה': GET משימה אחת לפי ID

### שלב 1: Route עם Parameters

**הוסיפו:**

```javascript
// 🔍 GET /api/tasks/:id - Get single task
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO: Write SELECT query with WHERE
    // Hint: SELECT * FROM tasks WHERE id = ?
    // TODO: Make sure to use ? and not concatenate id directly in the query!

    // Check if task exists
    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${id} not found`
      });
    }

    res.json({
      success: true,
      data: tasks[0]
    });
  } catch (err) {
    console.error('Error getting task:', err);
    res.status(500).json({
      success: false,
      message: 'Error getting task',
      error: err.message
    });
  }
});
```

### שלב 2: בדיקה

**נסו בדפדפן:**
- http://localhost:3000/api/tasks/1 - אמור להחזיר משימה
- http://localhost:3000/api/tasks/999 - אמור להחזיר 404

---

## חלק ו': PUT - עדכון משימה

### שלב 1: Route לעדכון

**הוסיפו:**

```javascript
// ✏️ PUT /api/tasks/:id - Update task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;

    // TODO: Check if task exists (SELECT)
    // TODO: If not exists - return 404
    
    // TODO: Write UPDATE query
    // Hint: UPDATE tasks SET title = ?, description = ?, status = ?, priority = ? WHERE id = ?
    // TODO: If a field wasn't sent in request body - use existing value
    
    // TODO: Get the updated task

    res.json({
      success: true,
      message: 'המשימה עודכנה בהצלחה!',
      data: updated[0]
    });
  } catch (err) {
    console.error('שגיאה בעדכון משימה:', err);
    res.status(500).json({
      success: false,
      message: 'שגיאה בעדכון משימה',
      error: err.message
    });
  }
});
```

### שלב 2: בדיקה

**Request:**
- Method: `PUT`
- URL: `http://localhost:3000/api/tasks/1`
- Body:
```json
{
  "status": "completed"
}
```

**Response:** המשימה עם status מעודכן!

---

## חלק ז': DELETE - מחיקת משימה

### שלב 1: Route למחיקה

**הוסיפו:**

```javascript
// 🗑️ DELETE /api/tasks/:id - Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Check if task exists (SELECT)
    // TODO: If not exists - return 404
    
    // TODO: Write DELETE query
    // Hint: DELETE FROM tasks WHERE id = ?

    res.json({
      success: true,
      message: 'Task deleted successfully!',
      data: existing[0]
    });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: err.message
    });
  }
});
```

### שלב 2: בדיקה

**Request:**
- Method: `DELETE`
- URL: `http://localhost:3000/api/tasks/1`

**Response:**
```json
{
  "success": true,
  "message": "המשימה נמחקה בהצלחה!"
}
```

---

## חלק ח': תרגילי בונוס 🌟

### תרגיל 1: סינון משימות לפי סטטוס

הוסיפו Query Parameters ל-GET /api/tasks:

```javascript
// GET /api/tasks?status=completed
// GET /api/tasks?priority=high
// GET /api/tasks?status=pending&priority=high
```

**מה צריך לעשות:**
1. קראו את `status` ו-`priority` מ-`req.query`
2. בנו שאילתת SQL דינמית שמוסיפה WHERE רק לשדות שנשלחו
3. השתמשו ב-Prepared Statements

**רמזים:**
- התחילו עם `WHERE 1=1` ואז הוסיפו תנאים
- שמרו את הערכים במערך `params`
- השתמשו ב-`if` לכל פרמטר

### תרגיל 2: נתונים סטטיסטיים

הוסיפו route לסטטיסטיקות:

```javascript
// GET /api/tasks/stats
```

**מה צריך להחזיר:**
```json
{
  "success": true,
  "stats": {
    "total": 10,
    "byStatus": {
      "pending": 5,
      "in_progress": 3,
      "completed": 2
    },
    "byPriority": {
      "low": 2,
      "medium": 5,
      "high": 3
    },
    "completionRate": 20
  }
}
```

**רמזים:**
- `COUNT(*)` - ספירת שורות
- `GROUP BY status` - קיבוץ לפי סטטוס
- חשבו את אחוז ההשלמה: `(completed / total) * 100`

### תרגיל 3: חיפוש משימות

```javascript
// GET /api/tasks/search?q=mysql
```

**מה צריך לעשות:**
1. חפשו משימות שהמילה מופיעה ב-`title` או ב-`description`
2. החזירו רק משימות שמכילות את מילת החיפוש
3. החיפוש לא רגיש לאותיות גדולות/קטנות

**רמזים:**
- השתמשו ב-`LIKE '%keyword%'`
- `OR` בין title ל-description
- אל תשכחו validation - חובה לספק מילת חיפוש!

### תרגיל 4: סידור לפי עדיפות

הוסיפו Query Parameter למיון:

```javascript
// GET /api/tasks?sortBy=priority&order=desc
// GET /api/tasks?sortBy=created_at&order=asc
```

**אפשרויות מיון:**
- `sortBy`: priority, status, created_at, title
- `order`: asc, desc

**רמזים:**
- בדקו שה-`sortBy` הוא אחד מהערכים המותרים (למניעת SQL Injection!)
- השתמשו ב-`ORDER BY ${sortBy} ${order}`
- ערך ברירת מחדל: `created_at DESC`

### תרגיל 5: הוספת Due Date

1. הוסיפו עמודה `due_date` לטבלה:
```sql
ALTER TABLE tasks ADD COLUMN due_date DATE;
```

2. עדכנו את POST ו-PUT לקבל תאריך יעד

3. צרו route שמחזיר רק משימות שפג תוקפן:
```javascript
// GET /api/tasks/overdue
```

**רמזים:**
- `WHERE due_date < CURDATE()`
- `AND status != 'completed'`
- ודאו שהתאריך בפורמט YYYY-MM-DD

### תרגיל 6: Pagination (דפדוף)

הוסיפו תמיכה בדפדוף:

```javascript
// GET /api/tasks?page=1&limit=10
```

**מה צריך להחזיר:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

**רמזים:**
- `LIMIT 10 OFFSET 0` - עמוד 1
- `LIMIT 10 OFFSET 10` - עמוד 2
- `offset = (page - 1) * limit`
- צריך 2 שאילתות: אחת לנתונים ואחת לספירה

---

## חלק ט': Best Practices וטיפים

### תרגיל 1: סינון משימות לפי סטטוס

הוסיפו Query Parameters ל-GET /api/tasks:

```javascript
// GET /api/tasks?status=completed
// GET /api/tasks?priority=high
```

**רמז:**
```javascript
app.get('/api/tasks', async (req, res) => {
  const { status, priority } = req.query;
  
  let query = 'SELECT * FROM tasks WHERE 1=1';
  const params = [];
  
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  
  if (priority) {
    query += ' AND priority = ?';
    params.push(priority);
  }
  
  query += ' ORDER BY created_at DESC';
  
  const [tasks] = await connection.query(query, params);
  // ...
});
```

### תרגיל 2: נתונים סטטיסטיים

הוסיפו route לסטטיסטיקות:

```javascript
// GET /api/stats
app.get('/api/stats', async (req, res) => {
  try {
    // TODO: כמה משימות יש סה"כ?
    // TODO: כמה completed, כמה pending, כמה in_progress?
    // TODO: מה האחוז של השלמה?
    
    const [totalResult] = await connection.query('SELECT COUNT(*) as total FROM tasks');
    const [statusCounts] = await connection.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM tasks
      GROUP BY status
    `);
    
    res.json({
      success: true,
      stats: {
        total: totalResult[0].total,
        byStatus: statusCounts
        // הוסיפו עוד...
      }
    });
  } catch (err) {
    // ...
  }
});
```

### תרגיל 3: חיפוש משימות

```javascript
// GET /api/tasks/search?q=mysql
app.get('/api/tasks/search', async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'חובה לספק מילת חיפוש'
    });
  }

  try {
    // TODO: חפשו משימות שבכותרת או בתיאור יש את מילת החיפוש
    const [results] = await connection.query(
      'SELECT * FROM tasks WHERE title LIKE ? OR description LIKE ?',
      [`%${q}%`, `%${q}%`]
    );
    
    res.json({
      success: true,
      query: q,
      count: results.length,
      data: results
    });
  } catch (err) {
    // ...
  }
});
```

### תרגיל 4: סידור לפי עדיפות

הוסיפו Query Parameter למיון:

```javascript
// GET /api/tasks?sortBy=priority&order=desc
```

**רמז:** השתמשו ב-ORDER BY במשפט SQL

### תרגיל 5: הוספת Due Date

1. הוסיפו עמודה `due_date` לטבלה
2. עדכנו את POST ו-PUT לקבל תאריך יעד
3. צרו route שמחזיר רק משימות שפג תוקפן

```sql
ALTER TABLE tasks ADD COLUMN due_date DATE;
```

```javascript
// GET /api/tasks/overdue
const [overdue] = await connection.query(
  'SELECT * FROM tasks WHERE due_date < CURDATE() AND status != "completed"'
);
```

---

## חלק ט': Best Practices וטיפים

### 1. תמיד השתמשו ב-Prepared Statements

**❌ לא טוב (SQL Injection!):**
```javascript
const query = `SELECT * FROM tasks WHERE id = ${id}`;
await connection.query(query);
```

**✅ טוב:**
```javascript
await connection.query('SELECT * FROM tasks WHERE id = ?', [id]);
```

### 2. טיפול בשגיאות

תמיד עטפו שאילתות ב-try/catch וספקו הודעות משמעותיות:

```javascript
try {
  // ...
} catch (err) {
  console.error('פירוט השגיאה:', err);
  res.status(500).json({
    success: false,
    message: 'הודעה ידידותית למשתמש',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}
```

### 3. Validation

השתמשו בספריות כמו `joi` או `express-validator`:

```bash
npm install joi
```

```javascript
import Joi from 'joi';

const taskSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().allow('').optional(),
  status: Joi.string().valid('pending', 'in_progress', 'completed'),
  priority: Joi.string().valid('low', 'medium', 'high')
});
```

### 4. ניהול החיבור למסד הנתונים

החיבור שיצרנו נשאר פתוח לאורך כל חיי השרת:
- לא צריך לפתוח ולסגור חיבור בכל פעם
- השרת יסגור את החיבור כשהוא נכבה (בזכות ה-SIGINT handler)
- אם רוצים חיבור יותר מתקדם עם מספר חיבורים במקביל - כדאי להשתמש ב-`createPool`

### 5. Environment Variables

**לעולם אל תשתפו את קובץ ה-.env!**
במקום זה, צרו `.env.example`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=tasks_db
DB_PORT=3306
PORT=3000
```

---

## חלק ב': מבנה מודולרי (MVC Pattern)

בחלק זה נבנה את אותה אפליקציה אבל עם ארכיטקטורה מודולרית - **MVC (Model-View-Controller)**

**למה מודולרי?**
- 📁 קוד מאורגן יותר וקל לתחזוקה
- 🔄 קל לעשות שינויים בלי לשבור דברים
- 👥 עבודה בצוות יותר קלה
- 🧪 בדיקות יותר פשוטות

### מבנה התיקיות

צרו את המבנה הבא:

```
express-mysql-tasks-modular/
├── server.js                  # נקודת כניסה
├── .env                       # משתני סביבה
├── .gitignore
├── package.json
├── config/
│   └── db.js                 # חיבור למסד נתונים
├── models/
│   └── taskModel.js          # שאילתות SQL
├── controllers/
│   └── taskController.js     # לוגיקה עסקית
├── routes/
│   └── taskRoutes.js         # הגדרת Routes
└── middleware/
    └── errorHandler.js       # טיפול בשגיאות
```

### שלב 1: הגדרות התחלתיות

```bash
mkdir express-mysql-tasks-modular
cd express-mysql-tasks-modular
npm init -y
npm install express mysql2 dotenv
npm install -D nodemon
```

**הוסיפו ל-package.json:**
```json
{
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### שלב 2: config/db.js - חיבור למסד נתונים

```javascript
import mysql from 'mysql2/promise';
import 'dotenv/config';

// TODO: יצרו חיבור למסד הנתונים
// TODO: הוסיפו פונקציה setupDatabase שיוצרת את טבלת tasks
// TODO: הפעילו את setupDatabase
// TODO: ייצאו את החיבור (export default connection)
```

**רמזים:**
- השתמשו ב-`createConnection`
- וודאו שהחיבור עובד
- יצרו את הטבלה כמו בחלק א'

### שלב 3: models/taskModel.js - שכבת הנתונים

```javascript
import connection from '../config/db.js';

// TODO: יצרו פונקציה getAll() שמחזירה את כל המשימות
// TODO: יצרו פונקציה getById(id) שמחזירה משימה לפי ID
// TODO: יצרו פונקציה create(taskData) שיוצרת משימה חדשה
// TODO: יצרו פונקציה update(id, taskData) שמעדכנת משימה
// TODO: יצרו פונקציה remove(id) שמוחקת משימה

// ייצוא כל הפונקציות
export default {
  // הוסיפו כאן את כל הפונקציות
};
```

**רמז למבנה:**
```javascript
const getAll = async () => {
  // TODO: כתבו את השאילתה
  return tasks;
};
```

### שלב 4: controllers/taskController.js - לוגיקה עסקית

```javascript
import Task from '../models/taskModel.js';

// TODO: כתבו פונקציה getAllTasks שמקבלת req, res
// TODO: כתבו פונקציה getTaskById שמקבלת req, res
// TODO: כתבו פונקציה createTask שמקבלת req, res
// TODO: כתבו פונקציה updateTask שמקבלת req, res
// TODO: כתבו פונקציה deleteTask שמקבלת req, res

// ייצאו את כל הפונקציות
export {
  // הוסיפו כאן
};
```

**רמז למבנה:**
```javascript
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.getAll();
    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    // טיפול בשגיאות
  }
};
```

### שלב 5: routes/taskRoutes.js - הגדרת Routes

```javascript
import express from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';

const router = express.Router();

// TODO: הגדירו את כל ה-routes
// GET /       -> getAllTasks
// GET /:id    -> getTaskById
// POST /      -> createTask
// PUT /:id    -> updateTask
// DELETE /:id -> deleteTask

export default router;
```

**רמז:**
```javascript
router.get('/', getAllTasks);
router.get('/:id', getTaskById);
// המשיכו...
```

### שלב 6: middleware/errorHandler.js - טיפול בשגיאות

```javascript
// TODO: יצרו middleware לטיפול בשגיאות 404
export const notFound = (req, res, next) => {
  // החזירו 404
};

// TODO: יצרו middleware כללי לטיפול בשגיאות
export const errorHandler = (err, req, res, next) => {
  // טפלו בשגיאה והחזירו תשובה מתאימה
};
```

### שלב 7: server.js - נקודת הכניסה

```javascript
import express from 'express';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import './config/db.js'; // טעינת החיבור למסד נתונים

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Welcome Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Modular Tasks API',
    version: '2.0.0',
    architecture: 'MVC Pattern',
    endpoints: '/api/tasks'
  });
});

// Routes
app.use('/api/tasks', taskRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

### בדיקה

אחרי שסיימתם הכל, בדקו:

```bash
npm run dev
```

**נסו:**
- `GET http://localhost:3000/api/tasks`
- `POST http://localhost:3000/api/tasks` - body: `{"title": "Test", "priority": "high"}`
- `GET http://localhost:3000/api/tasks/1`
- `PUT http://localhost:3000/api/tasks/1`
- `DELETE http://localhost:3000/api/tasks/1`

### יתרונות המבנה המודולרי

✅ **ניתן לתחזוקה** - כל חלק בקובץ נפרד  
✅ **ניתן לבדיקה** - קל לבדוק כל חלק בנפרד  
✅ **ניתן לשימוש חוזר** - אפשר להשתמש בקוד במקומות שונים  
✅ **עבודת צוות** - כל אחד עובד על קובץ אחר  
✅ **סולמיות** - קל להוסיף features חדשים

---

## סיכום

**במה עבדתם בחלק א':**
- ✅ יצירת חיבור ל-MySQL עם createConnection
- ✅ יצירת טבלאות אוטומטית בהפעלה
- ✅ פעולות CRUD מלאות בקובץ יחיד
- ✅ שאילתות SQL מאובטחות עם Prepared Statements

**במה עבדתם בחלק ב':**
- ✅ ארכיטקטורה מודולרית (MVC)
- ✅ הפרדת אחריות (Separation of Concerns)
- ✅ קוד מאורגן ונקי
- ✅ מבנה מקצועי לפרויקטים גדולים

**מה הבא?**
- 📚 למדו על Relationships (טבלאות מקושרות)
- 🔐 הוסיפו Authentication (JWT)
- 🧪 כתבו בדיקות אוטומטיות
- 🚀 העלו ל-Production (Render, Railway)
- 📖 קראו על Transactions ו-Indexes

---

## 💡 פתרונות מלאים

<details>
<summary><strong>לחצו כאן לראות את הפתרונות המלאים</strong></summary>

### חלק א': קובץ יחיד - server.js

```javascript
import express from 'express';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// ===================================
// יצירת חיבור למסד הנתונים
// ===================================

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

console.log('✅ Connected to database successfully!');

// Handle connection cleanup on server shutdown
process.on('SIGINT', async () => {
  await connection.end();
  console.log('🔌 Database connection closed');
  process.exit(0);
});

// ===================================
// Database Table Setup
// ===================================

async function setupDatabase() {
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
        priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tasks table is ready');
  } catch (err) {
    console.error('❌ Error creating table:', err.message);
  }
}

setupDatabase();

// ===================================
// Routes
// ===================================

// 🏠 בדיקת שרת
app.get('/', (req, res) => {
  res.json({
    message: 'שלום! ברוכים הבאים ל-API של ניהול משימות',
    endpoints: {
      'GET /api/tasks': 'קבלת כל המשימות',
      'GET /api/tasks/:id': 'קבלת משימה לפי ID',
      'POST /api/tasks': 'יצירת משימה חדשה',
      'PUT /api/tasks/:id': 'עדכון משימה',
      'DELETE /api/tasks/:id': 'מחיקת משימה'
    }
  });
});

// 📋 GET /api/tasks - Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const [tasks] = await connection.query('SELECT * FROM tasks ORDER BY created_at DESC');
    
    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    console.error('שגיאה בקבלת משימות:', err);
    res.status(500).json({
      success: false,
      message: 'שגיאה בקבלת משימות',
      error: err.message
    });
  }
});

// ➕ POST /api/tasks - Create new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    const [result] = await connection.query(
      'INSERT INTO tasks (title, description, status, priority) VALUES (?, ?, ?, ?)',
      [title, description || null, status || 'pending', priority || 'medium']
    );

    const [newTask] = await connection.query(
      'SELECT * FROM tasks WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'המשימה נוצרה בהצלחה!',
      data: newTask[0]
    });
  } catch (err) {
    console.error('שגיאה ביצירת משימה:', err);
    res.status(500).json({
      success: false,
      message: 'שגיאה ביצירת משימה',
      error: err.message
    });
  }
});

// 🔍 GET /api/tasks/:id - Get single task
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [tasks] = await connection.query(
      'SELECT * FROM tasks WHERE id = ?',
      [id]
    );

    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${id} not found`
      });
    }

    res.json({
      success: true,
      data: tasks[0]
    });
  } catch (err) {
    console.error('שגיאה בקבלת משימה:', err);
    res.status(500).json({
      success: false,
      message: 'שגיאה בקבלת משימה',
      error: err.message
    });
  }
});

// ✏️ PUT /api/tasks/:id - Update task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;

    const [existing] = await connection.query(
      'SELECT * FROM tasks WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${id} not found`
      });
    }

    await connection.query(
      'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ? WHERE id = ?',
      [
        title || existing[0].title,
        description !== undefined ? description : existing[0].description,
        status || existing[0].status,
        priority || existing[0].priority,
        id
      ]
    );

    const [updated] = await connection.query(
      'SELECT * FROM tasks WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'המשימה עודכנה בהצלחה!',
      data: updated[0]
    });
  } catch (err) {
    console.error('שגיאה בעדכון משימה:', err);
    res.status(500).json({
      success: false,
      message: 'שגיאה בעדכון משימה',
      error: err.message
    });
  }
});

// 🗑️ DELETE /api/tasks/:id - Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await connection.query(
      'SELECT * FROM tasks WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${id} not found`
      });
    }

    await connection.query('DELETE FROM tasks WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'המשימה נמחקה בהצלחה!',
      data: existing[0]
    });
  } catch (err) {
    console.error('שגיאה במחיקת משימה:', err);
    res.status(500).json({
      success: false,
      message: 'שגיאה במחיקת משימה',
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
```

### חלק ב': מבנה מודולרי

#### config/db.js
```javascript
import mysql from 'mysql2/promise';
import 'dotenv/config';

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

console.log('✅ Connected to database successfully!');

process.on('SIGINT', async () => {
  await connection.end();
  console.log('🔌 Database connection closed');
  process.exit(0);
});

async function setupDatabase() {
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
        priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tasks table is ready');
  } catch (err) {
    console.error('❌ Error creating table:', err.message);
  }
}

setupDatabase();

export default connection;
```

#### models/taskModel.js
```javascript
import connection from '../config/db.js';

const getAll = async () => {
  const [tasks] = await connection.query('SELECT * FROM tasks ORDER BY created_at DESC');
  return tasks;
};

const getById = async (id) => {
  const [tasks] = await connection.query('SELECT * FROM tasks WHERE id = ?', [id]);
  return tasks[0];
};

const create = async (taskData) => {
  const { title, description, status, priority } = taskData;
  const [result] = await connection.query(
    'INSERT INTO tasks (title, description, status, priority) VALUES (?, ?, ?, ?)',
    [title, description || null, status || 'pending', priority || 'medium']
  );
  return result.insertId;
};

const update = async (id, taskData) => {
  const { title, description, status, priority } = taskData;
  const existing = await getById(id);
  
  if (!existing) return false;
  
  await connection.query(
    'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ? WHERE id = ?',
    [
      title || existing.title,
      description !== undefined ? description : existing.description,
      status || existing.status,
      priority || existing.priority,
      id
    ]
  );
  return true;
};

const remove = async (id) => {
  const existing = await getById(id);
  if (!existing) return null;
  
  await connection.query('DELETE FROM tasks WHERE id = ?', [id]);
  return existing;
};

export default {
  getAll,
  getById,
  create,
  update,
  remove
};
```

#### controllers/taskController.js
```javascript
import Task from '../models/taskModel.js';

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.getAll();
    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    console.error('Error getting tasks:', err);
    res.status(500).json({
      success: false,
      message: 'Error getting tasks',
      error: err.message
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.getById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${id} not found`
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (err) {
    console.error('Error getting task:', err);
    res.status(500).json({
      success: false,
      message: 'Error getting task',
      error: err.message
    });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    const taskId = await Task.create({ title, description, status, priority });
    const newTask = await Task.getById(taskId);

    res.status(201).json({
      success: true,
      message: 'Task created successfully!',
      data: newTask
    });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({
      success: false,
      message: 'Error creating task',
      error: err.message
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;

    const updated = await Task.update(id, { title, description, status, priority });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${id} not found`
      });
    }

    const updatedTask = await Task.getById(id);

    res.json({
      success: true,
      message: 'Task updated successfully!',
      data: updatedTask
    });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({
      success: false,
      message: 'Error updating task',
      error: err.message
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Task.remove(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${id} not found`
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully!',
      data: deleted
    });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: err.message
    });
  }
};
```

#### routes/taskRoutes.js
```javascript
import express from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';

const router = express.Router();

router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
```

#### middleware/errorHandler.js
```javascript
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
```

</details>

---

## שאלות נפוצות

**1. מה ההבדל בין mysql ל-mysql2?**
- `mysql2` מהיר יותר ותומך ב-Promises וב-async/await
- מומלץ להשתמש ב-`mysql2`

**2. מה ההבדל בין createConnection ל-createPool?**
- `createConnection` - חיבור יחיד, פשוט למתחילים
- `createPool` - מנהל מספר חיבורים במקביל, יותר יעיל לאפליקציות גדולות
- למתחילים מומלץ להתחיל עם `createConnection`

**3. מה זה Prepared Statements?**
- שאילתות SQL מאובטחות מפני SQL Injection
- השתמשו תמיד ב-? ו-array של ערכים

**4. איך לראות את השאילתות ש-MySQL מריץ?**
```javascript
// הוסיפו לפני כל query:
console.log('Running query:', 'SELECT * FROM tasks');
const [tasks] = await connection.query('SELECT * FROM tasks');
console.log('Results:', tasks);
```

**5. איך למחוק את כל הנתונים ולהתחיל מחדש?**
```sql
TRUNCATE TABLE tasks;
```

---

## משאבים נוספים

- [MySQL Official Docs](https://dev.mysql.com/doc/)
- [mysql2 Package](https://www.npmjs.com/package/mysql2)
- [מדריך MySQL מלא](guides/hebrew/mysql-guide.md)
- [מדריך Docker + MySQL](guides/hebrew/mysql-docker-guide.md)
- [SQL Tutorial W3Schools](https://www.w3schools.com/sql/)

---

**בהצלחה! 🎉**

אם יש שאלות או בעיות - אל תהססו לשאול!
