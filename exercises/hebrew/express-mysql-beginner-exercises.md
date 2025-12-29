# תרגילי Express + MySQL למתחילים מוחלטים 🚀

## 📖 למי מיועדים התרגילים?
- אתם מכירים את היסודות של Node.js ו-Express
- סיימתם את [תרגילי MySQL למתחילים](./mysql-beginner-exercises.md)
- רוצים לשלב Express עם MySQL בצורה הדרגתית
- מעדיפים להתקדם שלב-אחר-שלב עם הסברים מפורטים

---

## 🎯 מה נבנה?
נבנה API לניהול רשימת משימות (Todo List) עם MySQL, שלב אחר שלב.

---

## תרגיל 0: הכנה והגדרת הפרויקט 🔧

### שלב 1: הכנת MySQL עם Docker 🐳

**וודאו ש-Docker מותקן:**
```bash
docker --version
```

אם Docker לא מותקן, עברו למדריך [mysql-docker-guide.md](../../guides/hebrew/mysql-docker-guide.md)

### שלב 2: הורדת קובץ Docker Compose

יש לכם שני אפשרויות:

**אפשרות א': העתקת הפרויקט הקיים**
```bash
# מתוך התיקייה הראשית
cp -r projects/docker-mysql-phpmyadmin express-mysql-todo
cd express-mysql-todo
```

**אפשרות ב': יצירה ידנית**
```bash
mkdir express-mysql-todo
cd express-mysql-todo
```

צרו קובץ `docker-compose.yml`:
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: mysql_todo
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: todo_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - todo_network

  phpmyadmin:
    image: phpmyadmin:latest
    container_name: phpmyadmin_todo
    restart: always
    environment:
      PMA_HOST: mysql
      PMA_PORT: 3306
      PMA_USER: root
      PMA_PASSWORD: root123
    ports:
      - "8080:80"
    depends_on:
      - mysql
    networks:
      - todo_network

networks:
  todo_network:
    driver: bridge

volumes:
  mysql_data:
```

### שלב 3: הפעלת MySQL ו-phpMyAdmin

```bash
docker-compose up -d
```

**בדיקה שהכל עובד:**
```bash
docker ps
```

אתם אמורים לראות 2 containers פעילים: `mysql_todo` ו-`phpmyadmin_todo`

**גישה ל-phpMyAdmin:**
פתחו בדפדפן: http://localhost:8080
- **Username:** root
- **Password:** root123

### שלב 4: הקמת פרויקט Node.js

```bash
npm init -y
```

### שלב 5: התקנת חבילות נדרשות
```bash
npm install express mysql2 dotenv
npm install -D nodemon
```

**הסבר החבילות:**
- `express` - שרת ה-API שלנו
- `mysql2` - חיבור ל-MySQL (גרסה עם Promises)
- `dotenv` - לניהול משתני סביבה
- `nodemon` - אוטומטית מפעיל מחדש את השרת

### שלב 6: עריכת package.json

פתחו את `package.json` והוסיפו:
```json
{
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### שלב 7: יצירת קובץ .env

צרו קובץ `.env` בשורש הפרויקט:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root123
DB_NAME=todo_db
DB_PORT=3306
PORT=3000
```

**💡 טיפ:** אם השתמשתם בסיסמה אחרת ב-docker-compose.yml, עדכנו כאן.

### שלב 8: הוספת .gitignore

צרו קובץ `.gitignore`:
```
node_modules/
.env
```

### ✅ בדיקה מהירה
וודאו שהמבנה שלכם נראה כך:
```
express-mysql-todo/
├── node_modules/
├── .env
├── .gitignore
├── docker-compose.yml
├── package.json
└── (server.js - ניצור בתרגיל הבא)
```

**וודאו ש-Docker containers פועלים:**
```bash
docker ps
```

**גישה ל-phpMyAdmin:** http://localhost:8080

---

## תרגיל 1: שרת Express בסיסי + חיבור ל-MySQL 🌐

### 🎯 מטרה
ליצור שרת Express פשוט שמתחבר ל-MySQL ובודק שהחיבור עובד.

### 📝 מה לעשות
צרו קובץ `server.js` שמריץ שרת על פורט 3000 ומתחבר ל-MySQL.

### 💡 רמזים

<details>
<summary>רמז 1: מבנה בסיסי של הקובץ</summary>

```javascript
import express from 'express';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// כאן נוסיף את החיבור למסד נתונים

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```
</details>

<details>
<summary>רמז 2: פונקציה ליצירת חיבור</summary>

```javascript
async function connectDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
    console.log('✅ Connected to MySQL!');
    return connection;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    process.exit(1);
  }
}
```
</details>

<details>
<summary>רמז 3: route בדיקה פשוט</summary>

```javascript
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Todo API!' });
});
```
</details>

### 📦 פתרון מלא

<details>
<summary>לחצו כאן לפתרון המלא</summary>

```javascript
import express from 'express';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// חיבור למסד נתונים
let db;

async function connectDB() {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
    console.log('✅ Connected to MySQL Database!');
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    process.exit(1);
  }
}

// Route בדיקה
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Todo API!',
    status: 'Server is running'
  });
});

// התחלת השרת
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await connectDB();
});
```
</details>

### 🧪 בדיקה
```bash
npm run dev
```

**תראו בטרמינל:**
```
🚀 Server running on http://localhost:3000
✅ Connected to MySQL Database!
```

**פתחו בדפדפן:** http://localhost:3000

### ✅ תוצאה מצופה
```json
{
  "message": "Welcome to Todo API!",
  "status": "Server is running"
}
```

---

## תרגיל 2: יצירת בסיס הנתונים והטבלה 🗄️

### 🎯 מטרה
ליצור את בסיס הנתונים `todo_db` ואת טבלת ה-`todos` באופן אוטומטי בעת הפעלת השרת.

### 📝 מה לעשות
הוסיפו פונקציה שיוצרת את בסיס הנתונים והטבלה אם הם לא קיימים.

### 📊 מבנה הטבלה
```sql
CREATE TABLE IF NOT EXISTS todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### 💡 רמזים

<details>
<summary>רמז 1: פונקציה ליצירת בסיס נתונים</summary>

```javascript
async function createDatabase() {
  const tempConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
  });
  
  await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
  console.log(`✅ Database '${process.env.DB_NAME}' ready`);
  await tempConnection.end();
}
```
</details>

<details>
<summary>רמז 2: פונקציה ליצירת טבלה</summary>

```javascript
async function createTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS todos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      completed BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  await db.query(query);
  console.log('✅ Table "todos" ready');
}
```
</details>

### 📦 פתרון מלא

<details>
<summary>לחצו כאן לפתרון המלא</summary>

```javascript
import express from 'express';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

let db;

// יצירת בסיס נתונים
async function createDatabase() {
  const tempConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
  });
  
  await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
  console.log(`✅ Database '${process.env.DB_NAME}' ready`);
  await tempConnection.end();
}

// חיבור למסד נתונים
async function connectDB() {
  try {
    await createDatabase();
    
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
    console.log('✅ Connected to MySQL Database!');
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    process.exit(1);
  }
}

// יצירת טבלה
async function createTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS todos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      completed BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  await db.query(query);
  console.log('✅ Table "todos" ready');
}

// Route בדיקה
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Todo API!',
    status: 'Server is running',
    database: 'Connected'
  });
});

// התחלת השרת
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await connectDB();
  await createTable();
});
```
</details>

### 🧪 בדיקה
```bash
npm run dev
```

**תראו בטרמינל:**
```
🚀 Server running on http://localhost:3000
✅ Database 'todo_db' ready
✅ Connected to MySQL Database!
✅ Table "todos" ready
```

**🖥️ בדיקה ב-phpMyAdmin:**
1. פתחו: http://localhost:8080
2. התחברו (root / root123)
3. לחצו על `todo_db` בצד שמאל
4. תראו את הטבלה `todos` עם 4 עמודות: `id`, `title`, `completed`, `created_at`

---

## תרגיל 3: הוספת משימה ראשונה (POST) ➕

### 🎯 מטרה
ליצור endpoint שמאפשר להוסיף משימה חדשה לבסיס הנתונים.

### 📝 מה לעשות
הוסיפו route שמקבל POST request עם כותרת משימה ושומר אותה ב-MySQL.

### 🔗 Endpoint
```
POST /todos
Body: { "title": "משימה חדשה" }
```

### 💡 רמזים

<details>
<summary>רמז 1: הוספת middleware לפרסור JSON</summary>

```javascript
app.use(express.json());
```

הוסיפו את זה מיד אחרי `const app = express();`
</details>

<details>
<summary>רמז 2: SQL Query להוספה</summary>

```sql
INSERT INTO todos (title) VALUES (?)
```
</details>

<details>
<summary>רמז 3: מבנה ה-route</summary>

```javascript
app.post('/todos', async (req, res) => {
  try {
    const { title } = req.body;
    
    // בדיקת תקינות
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    // הוספה למסד נתונים
    const [result] = await db.query(
      'INSERT INTO todos (title) VALUES (?)',
      [title]
    );
    
    res.status(201).json({
      message: 'Todo created',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```
</details>

### 📦 פתרון מלא

<details>
<summary>לחצו כאן להוספה ל-server.js</summary>

הוסיפו אחרי `const PORT = process.env.PORT || 3000;`:

```javascript
// Middleware
app.use(express.json());
```

הוסיפו לפני `app.listen`:

```javascript
// CREATE - הוספת משימה חדשה
app.post('/todos', async (req, res) => {
  try {
    const { title } = req.body;
    
    // בדיקת תקינות
    if (!title || title.trim() === '') {
      return res.status(400).json({ 
        error: 'Title is required and cannot be empty' 
      });
    }
    
    // הוספה למסד נתונים
    const [result] = await db.query(
      'INSERT INTO todos (title) VALUES (?)',
      [title.trim()]
    );
    
    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      todo: {
        id: result.insertId,
        title: title.trim(),
        completed: false
      }
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create todo' 
    });
  }
});
```
</details>

### 🧪 בדיקה עם Thunder Client / Postman

**Request:**
```
POST http://localhost:3000/todos
Content-Type: application/json

{
  "title": "לקנות חלב"
}
```

### ✅ תוצאה מצופה
```json
{
  "success": true,
  "message": "Todo created successfully",
  "todo": {
    "id": 1,
    "title": "לקנות חלב",
    "completed": false
  }
}
```

### 🧪 בדיקה עם curl (בטרמינל)
```bash
curl -X POST http://localhost:3000/todos -H "Content-Type: application/json" -d "{\"title\": \"לקנות חלב\"}"
```

**🖥️ בדיקה ב-phpMyAdmin:**
1. פתחו: http://localhost:8080
2. לחצו על `todo_db` → `todos`
3. לחצו על טאב "Browse"
4. תראו את המשימה החדשה בטבלה!

---

## תרגיל 4: הצגת כל המשימות (GET) 📋

### 🎯 מטרה
ליצור endpoint שמחזיר את כל המשימות מהבסיס נתונים.

### 📝 מה לעשות
הוסיפו route שמציג את כל המשימות בפורמט JSON.

### 🔗 Endpoint
```
GET /todos
```

### 💡 רמזים

<details>
<summary>רמז 1: SQL Query לקריאה</summary>

```sql
SELECT * FROM todos ORDER BY created_at DESC
```
</details>

<details>
<summary>רמז 2: המרת ערכי BOOLEAN</summary>

MySQL מחזיר 0/1 במקום true/false. צריך להמיר:

```javascript
const todos = rows.map(todo => ({
  ...todo,
  completed: Boolean(todo.completed)
}));
```
</details>

### 📦 פתרון מלא

<details>
<summary>לחצו כאן לפתרון המלא</summary>

הוסיפו לפני `app.listen`:

```javascript
// READ - הצגת כל המשימות
app.get('/todos', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM todos ORDER BY created_at DESC'
    );
    
    // המרת completed מ-0/1 ל-true/false
    const todos = rows.map(todo => ({
      ...todo,
      completed: Boolean(todo.completed)
    }));
    
    res.json({
      success: true,
      count: todos.length,
      todos: todos
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch todos' 
    });
  }
});
```
</details>

### 🧪 בדיקה
פתחו בדפדפן: http://localhost:3000/todos

**🖥️ בדיקה ב-phpMyAdmin:**
אפשר גם לראות את הנתונים ב-phpMyAdmin:
1. http://localhost:8080
2. `todo_db` → `todos` → Browse
3. תראו את כל המשימות בפורמט טבלה

### ✅ תוצאה מצופה
```json
{
  "success": true,
  "count": 1,
  "todos": [
    {
      "id": 1,
      "title": "לקנות חלב",
      "completed": false,
      "created_at": "2025-12-29T12:00:00.000Z"
    }
  ]
}
```

---

## תרגיל 5: הצגת משימה בודדת לפי ID (GET) 🔍

### 🎯 מטרה
ליצור endpoint שמחזיר משימה אחת ספציפית לפי ה-ID שלה.

### 📝 מה לעשות
הוסיפו route עם פרמטר ID.

### 🔗 Endpoint
```
GET /todos/:id
```

### 💡 רמזים

<details>
<summary>רמז 1: SQL Query עם WHERE</summary>

```sql
SELECT * FROM todos WHERE id = ?
```
</details>

<details>
<summary>רמז 2: בדיקה אם נמצא</summary>

```javascript
if (rows.length === 0) {
  return res.status(404).json({ error: 'Todo not found' });
}
```
</details>

### 📦 פתרון מלא

<details>
<summary>לחצו כאן לפתרון המלא</summary>

```javascript
// READ - הצגת משימה אחת
app.get('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await db.query(
      'SELECT * FROM todos WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Todo not found' 
      });
    }
    
    const todo = {
      ...rows[0],
      completed: Boolean(rows[0].completed)
    };
    
    res.json({
      success: true,
      todo: todo
    });
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch todo' 
    });
  }
});
```
</details>

### 🧪 בדיקה
פתחו בדפדפן: http://localhost:3000/todos/1

### ✅ תוצאה מצופה
```json
{
  "success": true,
  "todo": {
    "id": 1,
    "title": "לקנות חלב",
    "completed": false,
    "created_at": "2025-12-29T12:00:00.000Z"
  }
}
```

---

## תרגיל 6: עדכון משימה (PUT) ✏️

### 🎯 מטרה
ליצור endpoint לעדכון כותרת ו/או סטטוס של משימה.

### 📝 מה לעשות
הוסיפו route שמאפשר לעדכן title ו/או completed.

### 🔗 Endpoint
```
PUT /todos/:id
Body: { "title": "כותרת חדשה", "completed": true }
```

### 💡 רמזים

<details>
<summary>רמז 1: SQL Query לעדכון</summary>

```sql
UPDATE todos SET title = ?, completed = ? WHERE id = ?
```
</details>

<details>
<summary>רמז 2: בדיקה אם הרשומה עודכנה</summary>

```javascript
if (result.affectedRows === 0) {
  return res.status(404).json({ error: 'Todo not found' });
}
```
</details>

### 📦 פתרון מלא

<details>
<summary>לחצו כאן לפתרון המלא</summary>

```javascript
// UPDATE - עדכון משימה
app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    
    // בדיקת תקינות
    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({ 
        success: false,
        error: 'Title cannot be empty' 
      });
    }
    
    // קריאת המשימה הנוכחית
    const [current] = await db.query(
      'SELECT * FROM todos WHERE id = ?',
      [id]
    );
    
    if (current.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Todo not found' 
      });
    }
    
    // ערכים לעדכון (אם לא נשלחו - השאר את הקיימים)
    const updatedTitle = title !== undefined ? title.trim() : current[0].title;
    const updatedCompleted = completed !== undefined ? completed : Boolean(current[0].completed);
    
    // עדכון
    await db.query(
      'UPDATE todos SET title = ?, completed = ? WHERE id = ?',
      [updatedTitle, updatedCompleted, id]
    );
    
    res.json({
      success: true,
      message: 'Todo updated successfully',
      todo: {
        id: parseInt(id),
        title: updatedTitle,
        completed: updatedCompleted
      }
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update todo' 
    });
  }
});
```
</details>

### 🧪 בדיקה

**Request 1: עדכון הכותרת**
```
PUT http://localhost:3000/todos/1
Content-Type: application/json

{
  "title": "לקנות חלב ולבן"
}
```

**Request 2: סימון כהושלם**
```
PUT http://localhost:3000/todos/1
Content-Type: application/json

{
  "completed": true
}
```

### ✅ תוצאה מצופה
```json
{
  "success": true,
  "message": "Todo updated successfully",
  "todo": {
    "id": 1,
    "title": "לקנות חלב ולבן",
    "completed": true
  }
}
```

---

## תרגיל 7: מחיקת משימה (DELETE) 🗑️

### 🎯 מטרה
ליצור endpoint למחיקת משימה לפי ID.

### 📝 מה לעשות
הוסיפו route שמוחק משימה מהבסיס נתונים.

### 🔗 Endpoint
```
DELETE /todos/:id
```

### 💡 רמזים

<details>
<summary>רמז 1: SQL Query למחיקה</summary>

```sql
DELETE FROM todos WHERE id = ?
```
</details>

<details>
<summary>רמז 2: בדיקה אם נמחק</summary>

```javascript
if (result.affectedRows === 0) {
  return res.status(404).json({ error: 'Todo not found' });
}
```
</details>

### 📦 פתרון מלא

<details>
<summary>לחצו כאן לפתרון המלא</summary>

```javascript
// DELETE - מחיקת משימה
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query(
      'DELETE FROM todos WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Todo not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Todo deleted successfully',
      deletedId: parseInt(id)
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete todo' 
    });
  }
});
```
</details>

### 🧪 בדיקה

**Request:**
```
DELETE http://localhost:3000/todos/1
```

### ✅ תוצאה מצופה
```json
{
  "success": true,
  "message": "Todo deleted successfully",
  "deletedId": 1
}
```

---

## תרגיל 8: תכונות מתקדמות 🚀

### 🎯 מטרות
הוסיפו תכונות נוספות ל-API שלכם:

### תכונה 1: סינון משימות לפי סטטוס

**Endpoint:**
```
GET /todos?completed=true
GET /todos?completed=false
```

<details>
<summary>רמז: שינוי ה-GET todos</summary>

```javascript
app.get('/todos', async (req, res) => {
  try {
    const { completed } = req.query;
    
    let query = 'SELECT * FROM todos';
    let params = [];
    
    if (completed !== undefined) {
      query += ' WHERE completed = ?';
      params.push(completed === 'true' ? 1 : 0);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [rows] = await db.query(query, params);
    
    const todos = rows.map(todo => ({
      ...todo,
      completed: Boolean(todo.completed)
    }));
    
    res.json({
      success: true,
      count: todos.length,
      todos: todos
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch todos' 
    });
  }
});
```
</details>

### תכונה 2: סטטיסטיקות

**Endpoint:**
```
GET /todos/stats
```

<details>
<summary>פתרון מלא</summary>

```javascript
// STATS - סטטיסטיקות
app.get('/todos/stats', async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(completed) as completed,
        COUNT(*) - SUM(completed) as pending
      FROM todos
    `);
    
    res.json({
      success: true,
      stats: {
        total: stats[0].total,
        completed: stats[0].completed,
        pending: stats[0].pending
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch stats' 
    });
  }
});
```

**הערה:** ה-route הזה צריך להיות **לפני** `app.get('/todos/:id')` כי אחרת Express יחשוב ש-'stats' זה ID!
</details>

### תכונה 3: מחיקת כל המשימות המושלמות

**Endpoint:**
```
DELETE /todos/completed
```

<details>
<summary>פתרון מלא</summary>

```javascript
// DELETE - מחיקת כל המשימות המושלמות
app.delete('/todos/completed', async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM todos WHERE completed = 1'
    );
    
    res.json({
      success: true,
      message: 'Completed todos deleted successfully',
      deletedCount: result.affectedRows
    });
  } catch (error) {
    console.error('Error deleting completed todos:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete completed todos' 
    });
  }
});
```

**הערה:** ה-route הזה צריך להיות **לפני** `app.delete('/todos/:id')`!
</details>

---

## תרגיל 9: הפיכה למודולרי (MVC) 📁

### 🎯 מטרה
להפוך את הקוד ממבנה מונוליתי למבנה מודולרי עם MVC.

### 📝 מבנה התיקיות הרצוי
```
express-mysql-todo/
├── config/
│   └── database.js
├── controllers/
│   └── todoController.js
├── routes/
│   └── todoRoutes.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

### שלב 1: config/database.js

<details>
<summary>פתרון מלא</summary>

```javascript
import mysql from 'mysql2/promise';
import 'dotenv/config';

let db = null;

export async function createDatabase() {
  const tempConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
  });
  
  await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
  console.log(`✅ Database '${process.env.DB_NAME}' ready`);
  await tempConnection.end();
}

export async function connectDB() {
  try {
    await createDatabase();
    
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
    
    console.log('✅ Connected to MySQL Database!');
    return db;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    throw error;
  }
}

export async function createTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS todos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      completed BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  await db.query(query);
  console.log('✅ Table "todos" ready');
}

export function getDB() {
  return db;
}
```
</details>

### שלב 2: controllers/todoController.js

<details>
<summary>פתרון מלא</summary>

```javascript
import { getDB } from '../config/database.js';

// CREATE
export async function createTodo(req, res) {
  try {
    const db = getDB();
    const { title } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ 
        error: 'Title is required and cannot be empty' 
      });
    }
    
    const [result] = await db.query(
      'INSERT INTO todos (title) VALUES (?)',
      [title.trim()]
    );
    
    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      todo: {
        id: result.insertId,
        title: title.trim(),
        completed: false
      }
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create todo' 
    });
  }
}

// READ ALL
export async function getAllTodos(req, res) {
  try {
    const db = getDB();
    const { completed } = req.query;
    
    let query = 'SELECT * FROM todos';
    let params = [];
    
    if (completed !== undefined) {
      query += ' WHERE completed = ?';
      params.push(completed === 'true' ? 1 : 0);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [rows] = await db.query(query, params);
    
    const todos = rows.map(todo => ({
      ...todo,
      completed: Boolean(todo.completed)
    }));
    
    res.json({
      success: true,
      count: todos.length,
      todos: todos
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch todos' 
    });
  }
}

// READ ONE
export async function getTodoById(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;
    
    const [rows] = await db.query(
      'SELECT * FROM todos WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Todo not found' 
      });
    }
    
    const todo = {
      ...rows[0],
      completed: Boolean(rows[0].completed)
    };
    
    res.json({
      success: true,
      todo: todo
    });
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch todo' 
    });
  }
}

// UPDATE
export async function updateTodo(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;
    const { title, completed } = req.body;
    
    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({ 
        success: false,
        error: 'Title cannot be empty' 
      });
    }
    
    const [current] = await db.query(
      'SELECT * FROM todos WHERE id = ?',
      [id]
    );
    
    if (current.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Todo not found' 
      });
    }
    
    const updatedTitle = title !== undefined ? title.trim() : current[0].title;
    const updatedCompleted = completed !== undefined ? completed : Boolean(current[0].completed);
    
    await db.query(
      'UPDATE todos SET title = ?, completed = ? WHERE id = ?',
      [updatedTitle, updatedCompleted, id]
    );
    
    res.json({
      success: true,
      message: 'Todo updated successfully',
      todo: {
        id: parseInt(id),
        title: updatedTitle,
        completed: updatedCompleted
      }
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update todo' 
    });
  }
}

// DELETE
export async function deleteTodo(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;
    
    const [result] = await db.query(
      'DELETE FROM todos WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Todo not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Todo deleted successfully',
      deletedId: parseInt(id)
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete todo' 
    });
  }
}

// STATS
export async function getTodoStats(req, res) {
  try {
    const db = getDB();
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(completed) as completed,
        COUNT(*) - SUM(completed) as pending
      FROM todos
    `);
    
    res.json({
      success: true,
      stats: {
        total: stats[0].total,
        completed: stats[0].completed,
        pending: stats[0].pending
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch stats' 
    });
  }
}

// DELETE COMPLETED
export async function deleteCompletedTodos(req, res) {
  try {
    const db = getDB();
    const [result] = await db.query(
      'DELETE FROM todos WHERE completed = 1'
    );
    
    res.json({
      success: true,
      message: 'Completed todos deleted successfully',
      deletedCount: result.affectedRows
    });
  } catch (error) {
    console.error('Error deleting completed todos:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete completed todos' 
    });
  }
}
```
</details>

### שלב 3: routes/todoRoutes.js

<details>
<summary>פתרון מלא</summary>

```javascript
import express from 'express';
import {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  getTodoStats,
  deleteCompletedTodos
} from '../controllers/todoController.js';

const router = express.Router();

// CREATE
router.post('/', createTodo);

// READ
router.get('/', getAllTodos);
router.get('/stats', getTodoStats);  // לפני /:id!
router.get('/:id', getTodoById);

// UPDATE
router.put('/:id', updateTodo);

// DELETE
router.delete('/completed', deleteCompletedTodos);  // לפני /:id!
router.delete('/:id', deleteTodo);

export default router;
```
</details>

### שלב 4: server.js (מודולרי)

<details>
<summary>פתרון מלא</summary>

```javascript
import express from 'express';
import 'dotenv/config';
import { connectDB, createTable } from './config/database.js';
import todoRoutes from './routes/todoRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Todo API!',
    status: 'Server is running',
    endpoints: {
      getAllTodos: 'GET /todos',
      getTodoById: 'GET /todos/:id',
      createTodo: 'POST /todos',
      updateTodo: 'PUT /todos/:id',
      deleteTodo: 'DELETE /todos/:id',
      getStats: 'GET /todos/stats',
      deleteCompleted: 'DELETE /todos/completed'
    }
  });
});

app.use('/todos', todoRoutes);

// התחלת השרת
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  try {
    await connectDB();
    await createTable();
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
});
```
</details>

---

## 🐳 ניהול Docker Containers

### פקודות שימושיות:

**הצגת containers פעילים:**
```bash
docker ps
```

**עצירת המערכת:**
```bash
docker-compose down
```

**הפעלה מחדש:**
```bash
docker-compose up -d
```

**צפייה ב-logs של MySQL:**
```bash
docker logs mysql_todo
```

**כניסה ל-MySQL דרך terminal:**
```bash
docker exec -it mysql_todo mysql -u root -p
# הקלידו: root123
```

**מחיקה מלאה (כולל נתונים!):**
```bash
docker-compose down -v
```
⚠️ זה ימחק את כל הנתונים!

### שימוש ב-phpMyAdmin

**גישה:**
http://localhost:8080

**דברים שאפשר לעשות:**
- 📊 לראות את כל הטבלאות והנתונים
- ✏️ לערוך נתונים ישירות
- 🔍 להריץ שאילתות SQL מותאמות אישית
- 📥 לייבא/לייצא נתונים
- 🗑️ למחוק טבלאות או בסיסי נתונים

**טיפ:** השתמשו ב-phpMyAdmin כדי לבדוק שהנתונים נשמרים נכון אחרי כל פעולה!

---

## 🎉 סיכום

### מה למדנו:
✅ הקמת MySQL ו-phpMyAdmin עם Docker  
✅ יצירת שרת Express עם MySQL  
✅ חיבור לבסיס נתונים  
✅ יצירת טבלאות אוטומטית  
✅ פעולות CRUD מלאות (Create, Read, Update, Delete)  
✅ שימוש ב-Prepared Statements (הגנה מפני SQL Injection)  
✅ טיפול בשגיאות  
✅ סינון ושאילתות מתקדמות  
✅ מבנה מודולרי (MVC)  
✅ שימוש ב-phpMyAdmin לבדיקת נתונים  

### כלים שהשתמשנו בהם:
- 🐳 **Docker** - הרצת MySQL בסביבה מבודדת
- 🖥️ **phpMyAdmin** - ממשק גרפי לניהול MySQL
- 🚀 **Express** - שרת API
- 🗄️ **MySQL** - בסיס נתונים
- 📦 **mysql2** - חיבור Node.js ל-MySQL

### הצעדים הבאים:
- 🔐 הוסיפו אימות משתמשים (JWT)
- ✅ הוסיפו Validation מתקדם (express-validator)
- 📝 הוסיפו Middleware לוגים (morgan)
- 🧪 כתבו בדיקות אוטומטיות (Jest/Mocha)
- 🌐 הוסיפו CORS למשיכת נתונים מ-Frontend
- 🚀 Deploy ל-Production (Railway/Render)

### משאבים נוספים:
- 📚 [מדריך MySQL + Docker](../../guides/hebrew/mysql-docker-guide.md)
- 📁 [דוגמאות פרויקטים](../../projects/)
- 💪 [תרגילים מתקדמים](./mysql-simple-exercises.md)

---

**מזל טוב! השלמתם בהצלחה את תרגילי Express + MySQL עם Docker! 🎊**

**💡 זכרו:** תמיד אפשר לבדוק את הנתונים ב-phpMyAdmin ב-http://localhost:8080
