# 📂 מדריך File System Promises עם Node.js + Express

## 🎯 מה נלמד?

1. **fs.promises** - עבודה עם קבצים באופן אסינכרוני
2. **async/await** - תחביר נקי לפעולות אסינכרוניות
3. **CRUD עם קבצים** - יצירה, קריאה, עדכון, מחיקה
4. **שילוב עם Express** - API שעובד עם קבצים
5. **Best Practices** - איך לעשות את זה נכון

---

## 🤔 למה File System Promises?

### ❌ הדרך הישנה (Callbacks)
```javascript
fs.readFile('data.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});
```
**בעיות:**
- Callback Hell (קוד מקונן)
- קשה לטיפול בשגיאות
- לא אינטואיטיבי

---

### ✅ הדרך המודרנית (Promises + async/await)
```javascript
try {
  const data = await fs.readFile('data.json', 'utf8');
  console.log(data);
} catch (err) {
  console.error(err);
}
```
**יתרונות:**
- קוד נקי וקריא
- טיפול בשגיאות פשוט עם try/catch
- קל לשרשר פעולות
- תחביר מודרני

---

## 📦 התקנה והגדרה

### צעד 1: יצירת פרויקט

```bash
mkdir fs-promises-tutorial
cd fs-promises-tutorial
npm init -y
```

### צעד 2: התקנת Express

```bash
npm install express
```

### צעד 3: הגדרת package.json

הוסף את השורה הזו:
```json
{
  "type": "module"
}
```

**למה?** כדי להשתמש ב-`import` במקום `require`.

---

## 🔧 יסודות fs.promises

### ייבוא המודול

```javascript
import fs from 'fs/promises';
import express from 'express';

const app = express();
app.use(express.json());
```

---

### פעולות בסיס

#### 1️⃣ קריאת קובץ (Read)

```javascript
// קריאת קובץ טקסט
async function readTextFile() {
  try {
    const data = await fs.readFile('file.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error('Error reading file:', err);
  }
}

// קריאת JSON
async function readJsonFile() {
  try {
    const data = await fs.readFile('data.json', 'utf8');
    const jsonData = JSON.parse(data);
    console.log(jsonData);
  } catch (err) {
    console.error('Error reading JSON:', err);
  }
}
```

---

#### 2️⃣ כתיבת קובץ (Write)

```javascript
// כתיבת טקסט
async function writeTextFile() {
  try {
    await fs.writeFile('output.txt', 'Hello World!', 'utf8');
    console.log('File written successfully');
  } catch (err) {
    console.error('Error writing file:', err);
  }
}

// כתיבת JSON
async function writeJsonFile() {
  try {
    const data = { name: 'John', age: 30 };
    await fs.writeFile('data.json', JSON.stringify(data, null, 2), 'utf8');
    console.log('JSON file written successfully');
  } catch (err) {
    console.error('Error writing JSON:', err);
  }
}
```

**💡 טיפ:** `JSON.stringify(data, null, 2)` יוצר JSON מעוצב עם 2 רווחים.

---

#### 3️⃣ הוספה לקובץ (Append)

```javascript
async function appendToFile() {
  try {
    await fs.appendFile('log.txt', 'New log entry\n', 'utf8');
    console.log('Data appended successfully');
  } catch (err) {
    console.error('Error appending to file:', err);
  }
}
```

---

#### 4️⃣ מחיקת קובץ (Delete)

```javascript
async function deleteFile() {
  try {
    await fs.unlink('file.txt');
    console.log('File deleted successfully');
  } catch (err) {
    console.error('Error deleting file:', err);
  }
}
```

---

#### 5️⃣ בדיקה אם קובץ קיים

```javascript
async function fileExists(filepath) {
  try {
    await fs.access(filepath);
    return true;
  } catch {
    return false;
  }
}

// שימוש
const exists = await fileExists('data.json');
console.log('File exists:', exists);
```

---

#### 6️⃣ יצירת תיקייה

```javascript
async function createDirectory() {
  try {
    await fs.mkdir('data', { recursive: true });
    console.log('Directory created successfully');
  } catch (err) {
    console.error('Error creating directory:', err);
  }
}
```

**💡 טיפ:** `{ recursive: true }` יוצר גם תיקיות הורים אם צריך.

---

#### 7️⃣ קריאת רשימת קבצים בתיקייה

```javascript
async function listFiles() {
  try {
    const files = await fs.readdir('data');
    console.log('Files:', files);
  } catch (err) {
    console.error('Error reading directory:', err);
  }
}
```

---

## 🎨 דוגמה מעשית: CRUD עם קבצים

### מבנה הפרויקט

```
fs-promises-tutorial/
├── data/
│   └── users.json
├── server.js
└── package.json
```

### קובץ users.json (התחלתי)

```json
[]
```

---

### server.js - שרת מלא

```javascript
import fs from 'fs/promises';
import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// נתיב לקובץ הנתונים
const DATA_FILE = './data/users.json';

// ===================================
// פונקציות עזר לעבודה עם קבצים
// ===================================

// קריאת כל המשתמשים
async function readUsers() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    // אם הקובץ לא קיים, נחזיר מערך רק
    if (err.code === 'ENOENT') {
      return [];
    }
    throw err;
  }
}

// כתיבת משתמשים לקובץ
async function writeUsers(users) {
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// יצירת תיקיית data אם לא קיימת
async function ensureDataDirectory() {
  try {
    await fs.mkdir('./data', { recursive: true });
  } catch (err) {
    console.error('Error creating data directory:', err);
  }
}

// ===================================
// API Endpoints
// ===================================

// GET - קבל את כל המשתמשים
app.get('/users', async (req, res) => {
  try {
    const users = await readUsers();
    res.json({
      success: true,
      count: users.length,
      users
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
    const { name, email, age } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required'
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
      name,
      email,
      age: age || null,
      createdAt: new Date().toISOString()
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

    // עדכן משתמש
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      id: userId, // שמור על ID מקורי
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
// הפעלת השרת
// ===================================

async function startServer() {
  try {
    // וודא שתיקיית data קיימת
    await ensureDataDirectory();

    // הפעל שרת
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║  🚀 Server is running!                ║
║  📍 URL: http://localhost:${PORT}       ║
║  📂 Data file: ${DATA_FILE}            ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
```

---

## 🧪 בדיקת ה-API

### 1. יצירת משתמש
```bash
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "יוסי כהן",
  "email": "yossi@example.com",
  "age": 28
}
```

### 2. קבלת כל המשתמשים
```bash
GET http://localhost:3000/users
```

### 3. קבלת משתמש ספציפי
```bash
GET http://localhost:3000/users/1
```

### 4. עדכון משתמש
```bash
PUT http://localhost:3000/users/1
Content-Type: application/json

{
  "age": 29,
  "city": "תל אביב"
}
```

### 5. מחיקת משתמש
```bash
DELETE http://localhost:3000/users/1
```

---

## 💡 טיפים חשובים

### 1️⃣ תמיד השתמש ב-try/catch

```javascript
// ❌ לא טוב
async function readData() {
  const data = await fs.readFile('data.json', 'utf8');
  return JSON.parse(data);
}

// ✅ טוב
async function readData() {
  try {
    const data = await fs.readFile('data.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
}
```

---

### 2️⃣ טיפול בקובץ שלא קיים

```javascript
async function readUsers() {
  try {
    const data = await fs.readFile('users.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    // אם הקובץ לא קיים, החזר מערך ריק
    if (err.code === 'ENOENT') {
      return [];
    }
    // שגיאה אחרת - זרוק אותה
    throw err;
  }
}
```

---

### 3️⃣ עיצוב JSON קריא

```javascript
// ❌ קשה לקרוא
await fs.writeFile('data.json', JSON.stringify(data), 'utf8');

// ✅ קל לקרוא
await fs.writeFile('data.json', JSON.stringify(data, null, 2), 'utf8');
```

---

### 4️⃣ אל תשכח encoding

```javascript
// ✅ תמיד ציין 'utf8' לקבצי טקסט
await fs.readFile('file.txt', 'utf8');
await fs.writeFile('file.txt', 'content', 'utf8');
```

---

### 5️⃣ שימוש ב-Path לנתיבי קבצים

```javascript
import path from 'path';

// ✅ עובד בכל מערכת הפעלה
const dataPath = path.join('data', 'users.json');

// ❌ עלול לא לעבוד ב-Windows
const dataPath = 'data/users.json';
```

---

## 🔒 Best Practices

### 1. הפרדת הלוגיקה

צור קובץ נפרד לעבודה עם קבצים:

**fileHandler.js:**
```javascript
import fs from 'fs/promises';

export async function readJsonFile(filepath) {
  try {
    const data = await fs.readFile(filepath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return null;
    }
    throw err;
  }
}

export async function writeJsonFile(filepath, data) {
  await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf8');
}
```

**server.js:**
```javascript
import { readJsonFile, writeJsonFile } from './fileHandler.js';

app.get('/users', async (req, res) => {
  const users = await readJsonFile('./data/users.json');
  res.json(users || []);
});
```

---

### 2. יצירת Backup

```javascript
async function updateUsersWithBackup(users) {
  // צור backup
  const backupPath = `./data/users.backup.${Date.now()}.json`;
  
  try {
    // קרא נתונים ישנים
    const oldData = await fs.readFile('./data/users.json', 'utf8');
    await fs.writeFile(backupPath, oldData, 'utf8');
  } catch (err) {
    console.log('No backup needed, file doesn\'t exist');
  }

  // כתוב נתונים חדשים
  await writeUsers(users);
}
```

---

### 3. Validation של JSON

```javascript
async function readJsonSafely(filepath) {
  try {
    const data = await fs.readFile(filepath, 'utf8');
    
    // בדוק אם ה-JSON תקין
    try {
      return JSON.parse(data);
    } catch (parseErr) {
      console.error('Invalid JSON in file:', filepath);
      throw new Error('File contains invalid JSON');
    }
  } catch (err) {
    throw err;
  }
}
```

---

### 4. Logging

```javascript
async function logAction(action, data) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    data
  };
  
  const logLine = JSON.stringify(logEntry) + '\n';
  await fs.appendFile('./logs/app.log', logLine, 'utf8');
}

// שימוש
await logAction('USER_CREATED', { id: 1, name: 'John' });
```

---

## ⚠️ שגיאות נפוצות ופתרונות

### שגיאה 1: ENOENT - קובץ לא נמצא

```javascript
// ❌ הקוד קורס
const data = await fs.readFile('missing.json', 'utf8');

// ✅ טיפול בשגיאה
try {
  const data = await fs.readFile('missing.json', 'utf8');
} catch (err) {
  if (err.code === 'ENOENT') {
    console.log('File not found, creating new one');
    await fs.writeFile('missing.json', '[]', 'utf8');
  }
}
```

---

### שגיאה 2: EACCES - אין הרשאות

```javascript
// בדוק הרשאות לפני כתיבה
try {
  await fs.access('./data', fs.constants.W_OK);
} catch {
  console.error('No write permission for data directory');
}
```

---

### שגיאה 3: JSON לא תקין

```javascript
try {
  const data = await fs.readFile('data.json', 'utf8');
  const json = JSON.parse(data);
} catch (err) {
  if (err instanceof SyntaxError) {
    console.error('Invalid JSON format');
  } else {
    console.error('File read error:', err);
  }
}
```

---

## 🎯 תרגילים

### תרגיל 1 - ספר טלפונים
צור API לניהול אנשי קשר:
- `GET /contacts` - כל אנשי הקשר
- `POST /contacts` - הוסף איש קשר
- `PUT /contacts/:id` - עדכן איש קשר
- `DELETE /contacts/:id` - מחק איש קשר

---

### תרגיל 2 - מערכת לוגים
צור מערכת שרושמת כל פעולה בקובץ log:
- כל בקשה לשרת
- כל שינוי בנתונים
- שגיאות

---

### תרגיל 3 - מערכת Backup אוטומטית
צור מערכת שיוצרת backup כל דקה:
- שמור את הנתונים הנוכחיים
- מחק backups ישנים (מעל 10)
- אפשרות לשחזר מ-backup

---

## 📚 סיכום

### מה למדנו:
✅ **fs.promises** - עבודה עם קבצים באופן מודרני  
✅ **async/await** - תחביר נקי ונוח  
✅ **CRUD עם קבצים** - יצירה, קריאה, עדכון, מחיקה  
✅ **שילוב עם Express** - API מלא עם persistence  
✅ **Best Practices** - איך לעשות את זה נכון  
✅ **Error Handling** - טיפול בשגיאות  

### צעד הבא:
- 📊 MongoDB - מסד נתונים אמיתי
- 🔐 Authentication - אימות משתמשים
- 📁 File Upload - העלאת קבצים
- 🧪 Testing - בדיקות אוטומטיות

**בהצלחה! 🚀**
