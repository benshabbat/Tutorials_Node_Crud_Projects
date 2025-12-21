# 🎯 מדריך למתחילים - Node.js שלב אחר שלב

## מה זה Node.js? 🤔

Node.js מאפשר לכתוב קוד JavaScript בצד השרת (ולא רק בדפדפן). בעזרתו אפשר ליצור שרתים, לעבוד עם קבצים, ולבנות אפליקציות מלאות.

---

## Step 1️⃣ - התקנה

1. **הורד Node.js** מ-[nodejs.org](https://nodejs.org)
2. **התקן** (לחץ Next עד הסוף)
3. **בדיקה** - פתח Terminal (PowerShell או CMD):
   ```bash
   node --version
   ```
   רואה מספר? מעולה! ✅
   
   ```bash
   npm --version
   ```
   גם כאן צריך לראות מספר ✅

---

## Step 2️⃣ - יצירת פרויקט

פתח Terminal והעתק את הפקודות הבאות אחת אחת:

```bash
mkdir my-server
cd my-server
npm init -y
```

**מה עשינו?**
- `mkdir my-server` - יצרנו תיקייה חדשה
- `cd my-server` - נכנסנו לתיקייה
- `npm init -y` - יצרנו קובץ `package.json` (תעודת זהות של הפרויקט)

עכשיו יש לך תיקייה עם קובץ `package.json` 📦

---

## Step 3️⃣ - הגדרת הפרויקט

פתח את קובץ `package.json` והוסף את השורה `"type": "module"`:

```json
{
  "name": "my-server",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  }
}
```

**למה?** כדי להשתמש ב-`import` (תחביר מודרני) 🚀

---

## Step 4️⃣ - התקנת Express

Express זה פריימוורק שעוזר לנו לבנות שרתים בקלות:

```bash
npm install express
```

---

## Step 5️⃣ - יצירת שרת פשוט ראשון

צור קובץ `server.js` והעתק פנימה:

```javascript
import express from 'express';

const app = express();
const PORT = 3000;

// נקודת בדיקה ראשונה
app.get('/', (req, res) => {
  res.send('שלום! השרת שלי עובד! 🎉');
});

// הפעלת השרת
app.listen(PORT, () => {
  console.log(`השרת רץ על http://localhost:${PORT}`);
});
```

**הרצה:**
```bash
npm run dev
```

**בדיקה:**
פתח דפדפן וגש ל-http://localhost:3000

---

## Step 6️⃣ - הוספת עוד נתיבים (Routes)

בוא נוסיף עוד נתיבים לשרת:

```javascript
import express from 'express';

const app = express();
const PORT = 3000;

// דף הבית
app.get('/', (req, res) => {
  res.send('שלום! ברוך הבא לשרת שלי 🎉');
});

// דף About
app.get('/about', (req, res) => {
  res.send('זה שרת Node.js שנבנה בעזרת Express');
});

// דף עם JSON
app.get('/api/info', (req, res) => {
  res.json({
    message: 'זה JSON',
    version: '1.0.0',
    status: 'פעיל'
  });
});

app.listen(PORT, () => {
  console.log(`השרת רץ על http://localhost:${PORT}`);
});
```

**בדיקה:**
- http://localhost:3000
- http://localhost:3000/about
- http://localhost:3000/api/info

---

## Step 7️⃣ - עבודה עם File System (fs)

### דוגמה 1: קריאת קובץ

צור קובץ `data.txt` עם טקסט כלשהו, ואז:

```javascript
import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;

// קריאת קובץ
app.get('/read-file', async (req, res) => {
  try {
    const data = await fs.readFile('data.txt', 'utf-8');
    res.send(`תוכן הקובץ: ${data}`);
  } catch (error) {
    res.status(500).send('שגיאה בקריאת הקובץ');
  }
});

app.listen(PORT, () => {
  console.log(`השרת רץ על http://localhost:${PORT}`);
});
```

### דוגמה 2: כתיבה לקובץ

```javascript
import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;

// כתיבה לקובץ
app.get('/write-file', async (req, res) => {
  try {
    const message = `נכתב ב-${new Date().toLocaleString('he-IL')}`;
    await fs.writeFile('log.txt', message);
    res.send('הקובץ נכתב בהצלחה! ✅');
  } catch (error) {
    res.status(500).send('שגיאה בכתיבת הקובץ');
  }
});

app.listen(PORT, () => {
  console.log(`השרת רץ על http://localhost:${PORT}`);
});
```

### דוגמה 3: הוספת תוכן לקובץ קיים

```javascript
import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;

// הוספה לקובץ
app.get('/append-file', async (req, res) => {
  try {
    const message = `\nשורה חדשה: ${new Date().toLocaleString('he-IL')}`;
    await fs.appendFile('log.txt', message);
    res.send('השורה נוספה בהצלחה! ✅');
  } catch (error) {
    res.status(500).send('שגיאה בהוספת תוכן');
  }
});

app.listen(PORT, () => {
  console.log(`השרת רץ על http://localhost:${PORT}`);
});
```

---

## Step 8️⃣ - שרת מלא עם fs - ניהול רשימת משימות

דוגמה מלאה לשרת שמנהל רשימת משימות בעזרת קובץ JSON:

```javascript
import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;
const TASKS_FILE = 'tasks.json';

// Middleware לקריאת JSON מהבקשה
app.use(express.json());

// פונקציה לקריאת משימות מהקובץ
async function readTasks() {
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return []; // אם הקובץ לא קיים, נחזיר מערך רק
  }
}

// פונקציה לכתיבת משימות לקובץ
async function writeTasks(tasks) {
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

// קבלת כל המשימות
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await readTasks();
    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'שגיאה בקריאת משימות' });
  }
});

// יצירת משימה חדשה
app.post('/tasks', async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ 
        success: false, 
        message: 'חובה לספק כותרת למשימה' 
      });
    }
    
    const tasks = await readTasks();
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    await writeTasks(tasks);
    
    res.status(201).json({
      success: true,
      message: 'משימה נוצרה בהצלחה',
      data: newTask
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'שגיאה ביצירת משימה' });
  }
});

// מחיקת משימה
app.delete('/tasks/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const tasks = await readTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    if (tasks.length === filteredTasks.length) {
      return res.status(404).json({ 
        success: false, 
        message: 'משימה לא נמצאה' 
      });
    }
    
    await writeTasks(filteredTasks);
    
    res.json({
      success: true,
      message: 'משימה נמחקה בהצלחה'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'שגיאה במחיקת משימה' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 השרת רץ על http://localhost:${PORT}`);
  console.log(`📝 נסה: GET http://localhost:${PORT}/tasks`);
});
```

**בדיקה עם הדפדפן או Postman:**
- `GET http://localhost:3000/tasks` - צפייה בכל המשימות
- `POST http://localhost:3000/tasks` - יצירת משימה (שלח JSON: `{"title": "משימה חדשה"}`)
- `DELETE http://localhost:3000/tasks/123` - מחיקת משימה

---

## Step 9️⃣ - טיפים חשובים 💡

### 1. שמירת קבצים אוטומטית
השתמש ב-`--watch` כדי שהשרת יעלה מחדש אוטומטית:
```bash
node --watch server.js
```

### 2. טיפול בשגיאות
תמיד השתמש ב-`try-catch` כשעובדים עם fs:
```javascript
try {
  const data = await fs.readFile('file.txt', 'utf-8');
} catch (error) {
  console.error('שגיאה:', error.message);
}
```

### 3. בדיקת קיום קובץ
```javascript
import fs from 'fs/promises';

async function fileExists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}
```

### 4. קריאת כל הקבצים בתיקייה
```javascript
const files = await fs.readdir('./data');
console.log(files);
```

---

## Step 🔟 - דוגמה מורכבת יותר - שרת קבצים

שרת שמאפשר העלאה, צפייה ומחיקה של קבצים:

```javascript
import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = 3000;
const UPLOADS_DIR = './uploads';

app.use(express.json());

// יצירת תיקיית uploads אם לא קיימת
async function ensureUploadsDir() {
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR);
  }
}

ensureUploadsDir();

// רשימת כל הקבצים
app.get('/files', async (req, res) => {
  try {
    const files = await fs.readdir(UPLOADS_DIR);
    const filesInfo = await Promise.all(
      files.map(async (file) => {
        const stats = await fs.stat(path.join(UPLOADS_DIR, file));
        return {
          name: file,
          size: stats.size,
          modified: stats.mtime
        };
      })
    );
    
    res.json({
      success: true,
      count: filesInfo.length,
      data: filesInfo
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'שגיאה בקריאת קבצים' });
  }
});

// קריאת קובץ מסוים
app.get('/files/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(UPLOADS_DIR, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    
    res.json({
      success: true,
      filename,
      content
    });
  } catch (error) {
    res.status(404).json({ success: false, message: 'קובץ לא נמצא' });
  }
});

// יצירת קובץ חדש
app.post('/files', async (req, res) => {
  try {
    const { filename, content } = req.body;
    
    if (!filename || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'חובה לספק שם קובץ ותוכן' 
      });
    }
    
    const filePath = path.join(UPLOADS_DIR, filename);
    await fs.writeFile(filePath, content);
    
    res.status(201).json({
      success: true,
      message: 'קובץ נוצר בהצלחה',
      filename
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'שגיאה ביצירת קובץ' });
  }
});

// מחיקת קובץ
app.delete('/files/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(UPLOADS_DIR, filename);
    await fs.unlink(filePath);
    
    res.json({
      success: true,
      message: 'קובץ נמחק בהצלחה'
    });
  } catch (error) {
    res.status(404).json({ success: false, message: 'קובץ לא נמצא' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 שרת קבצים רץ על http://localhost:${PORT}`);
});
```

---

## סיכום מהיר 📚

**מה למדנו:**
1. ✅ איך להתקין Node.js
2. ✅ איך ליצור פרויקט חדש
3. ✅ איך להקים שרת עם Express
4. ✅ איך לעבוד עם נתיבים (Routes)
5. ✅ איך לקרוא ולכתוב קבצים עם fs
6. ✅ איך לבנות API פשוט עם קבצי JSON
7. ✅ איך לנהל קבצים בשרת

**צעדים הבאים:**
- התנסה עם הדוגמאות
- נסה לשנות את הקוד ולראות מה קורה
- צור פרויקטים קטנים משלך
- למד על Middleware ו-Authentication

בהצלחה! 🎉

---

## שאלות נפוצות ❓

**ש: השרת לא עולה, מה לעשות?**
ת: בדוק שאין שרת אחר שרץ על אותו פורט (3000). נסה לשנות את הפורט.

**ש: איך לעצור את השרת?**
ת: לחץ `Ctrl + C` בטרמינל.

**ש: מה ההבדל בין fs ו-fs/promises?**
ת: `fs/promises` מאפשר לנו להשתמש ב-async/await (יותר נוח ונקי).

**ש: איפה רואים את הקבצים שנוצרים?**
ת: באותה תיקייה שבה רץ השרת (או בתיקייה שהגדרת).

---

## Step 4️⃣ - Install Express (המשך המדריך המקורי)

```bash
npm install express
```

**What is Express?** A tool that helps us build a server easily ⚡

---

## Step 5️⃣ - Create the Server

Create a new file called `server.js` and copy this code:

```javascript
import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('🎉 My server is working!');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
```

---

## Step 6️⃣ - Run the Server

```bash
node server.js
```

You should see:
```
✅ Server running on http://localhost:3000
```

**Open in browser:** `http://localhost:3000`

**Congratulations! 🎊 Your server is running!**

---

## 💪 Upgrade - Server with Users

Want to add a user list? Update `server.js`:

```javascript
import express from 'express';

const app = express();
const PORT = 3000;

// To receive JSON
app.use(express.json());

// User list
let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

// Home page
app.get('/', (req, res) => {
  res.send('🎉 Welcome to my API!');
});

// Get all users
app.get('/users', (req, res) => {
  res.json(users);
});

// Get specific user
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  res.json(user || { error: 'Not found' });
});

// Add new user
app.post('/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name
  };
  users.push(newUser);
  res.json(newUser);
});

// Delete user
app.delete('/users/:id', (req, res) => {
  users = users.filter(u => u.id != req.params.id);
  res.json({ message: '✅ Deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
```

**Run again:**
```bash
node server.js
```

---

## 🧪 Testing

### In Browser:
```
http://localhost:3000/users
```

### In PowerShell:

**Get users:**
```powershell
Invoke-RestMethod http://localhost:3000/users
```

**Add user:**
```powershell
Invoke-RestMethod -Uri http://localhost:3000/users -Method Post -Body '{"name":"Charlie"}' -ContentType "application/json"
```

**Delete user:**
```powershell
Invoke-RestMethod -Uri http://localhost:3000/users/1 -Method Delete
```

---

## 💡 Important Tip

If you change the code and the server doesn't update - stop it (Ctrl+C) and run again.

**Or use auto-reload:**
```bash
node --watch server.js
```

Now every change will restart the server automatically! 🔄

---

## 📝 Quick Summary

**What did we do?**
1. ✅ Installed Node.js
2. ✅ Created a project
3. ✅ Installed Express
4. ✅ Built a working server
5. ✅ Added a user list

**What's next?**
- 🎨 Build a user interface (HTML/React)
- 💾 Connect to a database (MongoDB)
- 🔐 Add authentication

---

## 🆘 Common Issues

### Server not working?
1. Check Node.js is installed: `node --version`
2. Check Express is installed: `npm install`
3. Check the code is correct - any errors?

### Browser shows nothing?
- Make sure the server is running (you'll see a message in terminal)
- Check the address: `http://localhost:3000`

### Changes not working?
- Stop the server (Ctrl+C)
- Run again: `node server.js`

---

## 🎉 Excellent!

**Now you know how to:**
- ✅ Set up a Node.js server
- ✅ Use Express
- ✅ Build a simple API
- ✅ Test the server

**Practice and get better! 💪**

**Good luck! 🚀**
