# תרגילי MySQL פשוטים - צעד אחר צעד

## 📘 מבוא
תרגילים אלו מתחילים מהבסיס ומתקדמים בהדרגה. כל תרגיל הוא עצמאי ומכיל הסבר מפורט.

---

## תרגיל 1: התחברות ראשונה ל-MySQL

### 🎯 מטרה
ללמוד להתחבר ל-MySQL ולהריץ שאילתה פשוטה

### 📋 דרישות
- התחבר ל-MySQL
- הרץ שאילתה שמחזירה את גרסת MySQL
- הדפס את הגרסה
- סגור את החיבור

### 💡 רמזים
<details>
<summary>רמז 1: הגדרת הפרויקט</summary>

```bash
mkdir mysql-exercise-1
cd mysql-exercise-1
npm init -y
npm install mysql2 dotenv
```

אל תשכח להוסיף `"type": "module"` ב-package.json
</details>

<details>
<summary>רמז 2: קובץ .env</summary>

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=test_db
```
</details>

<details>
<summary>רמז 3: שאילתת גרסה</summary>

```sql
SELECT VERSION() as version
```
</details>

### ✅ תוצאה מצופה
```
✅ Successfully connected to MySQL!
MySQL Version: 8.0.33
Connection closed successfully
```

---

## תרגיל 2: יצירת בסיס נתונים וטבלה

### 🎯 מטרה
ללמוד ליצור בסיס נתונים וטבלה פשוטה

### 📋 דרישות
צור קובץ `create-db.js` שמבצע:
1. יצירת בסיס נתונים `students_db`
2. יצירת טבלה `students` עם העמודות:
   - `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
   - `name` (VARCHAR 100, NOT NULL)
   - `age` (INT, NOT NULL)
   - `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### 💡 רמזים
<details>
<summary>רמז 1: יצירת בסיס נתונים</summary>

```sql
CREATE DATABASE IF NOT EXISTS students_db
```

אחרי זה צריך לעבור לבסיס הנתונים:
```sql
USE students_db
```
</details>

<details>
<summary>רמז 2: יצירת טבלה</summary>

```sql
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```
</details>

### ✅ תוצאה מצופה
```
✅ Database students_db created
✅ Table students created
```

---

## תרגיל 3: הוספת נתונים (INSERT)

### 🎯 מטרה
ללמוד להוסיף נתונים לטבלה

### 📋 דרישות
צור קובץ `insert.js` שמוסיף סטודנט אחד:
- Name: "John Doe"
- Age: 25

הדפס את ה-ID של הסטודנט החדש.

### 💡 רמזים
<details>
<summary>רמז 1: INSERT Query</summary>

```sql
INSERT INTO students (name, age) VALUES (?, ?)
```

השימוש ב-`?` מונע SQL Injection!
</details>

<details>
<summary>רמז 2: קבלת ID</summary>

```javascript
const [result] = await connection.query(/* ... */);
console.log('New student ID:', result.insertId);
```
</details>

### ✅ תוצאה מצופה
```
✅ Student added successfully!
New student ID: 1
```

---

## תרגיל 4: קריאת נתונים (SELECT)

### 🎯 מטרה
ללמוד לקרוא נתונים מהטבלה

### 📋 דרישות
1. קודם צור קובץ `insert-many.js` והוסף 3 סטודנטים נוספים:
   - "Sarah Cohen" - 22
   - "Mike Wilson" - 28
   - "Emma Brown" - 24

2. אחר כך צור `select.js` שמציג את כל הסטודנטים בפורמט נקי

### 💡 רמזים
<details>
<summary>רמז 1: הוספת מספר רשומות</summary>

```javascript
const students = [
  ['Sarah Cohen', 22],
  ['Mike Wilson', 28],
  ['Emma Brown', 24]
];

for (const [name, age] of students) {
  await connection.query(
    'INSERT INTO students (name, age) VALUES (?, ?)',
    [name, age]
  );
}
```
</details>

<details>
<summary>רמז 2: SELECT והדפסה</summary>

```javascript
const [rows] = await connection.query('SELECT * FROM students');

rows.forEach(student => {
  console.log(`ID: ${student.id}`);
  console.log(`Name: ${student.name}`);
  console.log(`Age: ${student.age}`);
  console.log('-------------------');
});
```
</details>

### ✅ תוצאה מצופה
```
📚 Students List:
-------------------
ID: 1
Name: John Doe
Age: 25
-------------------
ID: 2
Name: Sarah Cohen
Age: 22
-------------------
...
Total: 4 students
```

---

## תרגיל 5: חיפוש לפי תנאי (WHERE)

### 🎯 מטרה
ללמוד לסנן נתונים עם WHERE

### 📋 דרישות
צור קובץ `search.js` שמבצע 3 חיפושים:
1. סטודנטים מעל גיל 23
2. סטודנט לפי שם מדויק
3. סטודנט לפי ID

### 💡 רמזים
<details>
<summary>רמז 1: חיפוש לפי גיל</summary>

```sql
SELECT * FROM students WHERE age > ?
```
</details>

<details>
<summary>רמז 2: חיפוש לפי שם</summary>

```sql
SELECT * FROM students WHERE name = ?
```
</details>

<details>
<summary>רמז 3: חיפוש לפי ID</summary>

```sql
SELECT * FROM students WHERE id = ?
```

כדי לקבל רק תוצאה אחת:
```javascript
const [rows] = await connection.query(/* ... */);
console.log(rows[0]); // רק התוצאה הראשונה
```
</details>

### ✅ תוצאה מצופה
```
🔍 Students over 23:
[{ id: 1, name: 'John Doe', age: 25, ... },
 { id: 3, name: 'Mike Wilson', age: 28, ... }]

🔍 Search by name "John Doe":
{ id: 1, name: 'John Doe', age: 25, ... }

🔍 Student with ID 1:
{ id: 1, name: 'John Doe', age: 25, ... }
```

---

## תרגיל 6: עדכון נתונים (UPDATE)

### 🎯 מטרה
ללמוד לעדכן נתונים קיימים

### 📋 דרישות
צור קובץ `update.js` שמבצע:
1. עדכן את הגיל של הסטודנט עם ID 1 ל-26
2. הדפס כמה שורות עודכנו
3. הצג את הסטודנט המעודכן

### 💡 רמזים
<details>
<summary>רמז 1: UPDATE Query</summary>

```sql
UPDATE students SET age = ? WHERE id = ?
```

**חשוב:** תמיד להשתמש ב-WHERE!
</details>

<details>
<summary>רמז 2: בדיקת עדכון</summary>

```javascript
const [result] = await connection.query(/* UPDATE */);
console.log('Rows updated:', result.affectedRows);

// Then SELECT to verify
const [updated] = await connection.query(
  'SELECT * FROM students WHERE id = ?',
  [studentId]
);
```
</details>

### ✅ תוצאה מצופה
```
✅ Update completed!
Rows updated: 1

📝 Updated info:
{ id: 1, name: 'John Doe', age: 26, ... }
```

---

## תרגיל 7: מחיקת נתונים (DELETE)

### 🎯 מטרה
ללמוד למחוק נתונים בבטחה

### 📋 דרישות
צור קובץ `delete.js` שמבצע:
1. הצג את הסטודנט עם ID 2
2. מחק אותו
3. נסה לחפש אותו שוב כדי לוודא שנמחק

### 💡 רמזים
<details>
<summary>רמז 1: DELETE Query</summary>

```sql
DELETE FROM students WHERE id = ?
```

⚠️ **אזהרה:** בלי WHERE ימחק הכל!
</details>

<details>
<summary>רמז 2: תהליך מלא</summary>

```javascript
// 1. Show before
const [before] = await connection.query('SELECT * FROM students WHERE id = ?', [id]);

// 2. Delete
const [result] = await connection.query('DELETE FROM students WHERE id = ?', [id]);

// 3. Verify
const [after] = await connection.query('SELECT * FROM students WHERE id = ?', [id]);
if (after.length === 0) {
  console.log('Student deleted successfully!');
}
```
</details>

### ✅ תוצאה מצופה
```
🗑️ Student to delete:
{ id: 2, name: 'Sarah Cohen', age: 22, ... }

✅ Student deleted!
Rows deleted: 1

✅ Verified: Student not found
```

---

## תרגיל 8: API פשוט עם Express + MySQL

### 🎯 מטרה
לבנות API REST מלא עם כל פעולות ה-CRUD

### 📋 דרישות
צור קובץ `server.js` עם הנתיבים הבאים:
- `GET /students` - קבלת כל הסטודנטים
- `GET /students/:id` - קבלת סטודנט אחד
- `POST /students` - הוספת סטודנט (body: name, age)
- `PUT /students/:id` - עדכון סטודנט (body: name, age)
- `DELETE /students/:id` - מחיקת סטודנט

### 💡 רמזים
<details>
<summary>רמז 1: התקנה והגדרה</summary>

```bash
npm install express
```

```javascript
import express from 'express';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const app = express();
app.use(express.json());

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'students_db',
  waitForConnections: true,
  connectionLimit: 10
});
```
</details>

<details>
<summary>רמז 2: GET /students</summary>

```javascript
app.get('/students', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```
</details>

<details>
<summary>רמז 3: GET /students/:id</summary>

```javascript
app.get('/students/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM students WHERE id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```
</details>

<details>
<summary>רמז 4: POST /students</summary>

```javascript
app.post('/students', async (req, res) => {
  try {
    const { name, age } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO students (name, age) VALUES (?, ?)',
      [name, age]
    );
    
    res.status(201).json({
      message: 'Student added successfully',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```
</details>

<details>
<summary>רמז 5: PUT /students/:id</summary>

```javascript
app.put('/students/:id', async (req, res) => {
  try {
    const { name, age } = req.body;
    
    const [result] = await pool.query(
      'UPDATE students SET name = ?, age = ? WHERE id = ?',
      [name, age, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```
</details>

<details>
<summary>רמז 6: DELETE /students/:id</summary>

```javascript
app.delete('/students/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM students WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```
</details>

<details>
<summary>רמז 7: הפעלת השרת</summary>

```javascript
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
```
</details>

### 🧪 בדיקות
```bash
# Get all students
curl http://localhost:3000/students

# Get one student
curl http://localhost:3000/students/1

# Add student
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Alex Taylor","age":23}'

# Update student
curl -X PUT http://localhost:3000/students/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","age":27}'

# Delete student
curl -X DELETE http://localhost:3000/students/3
```

---

## 📚 סיכום מה למדנו

1. ✅ חיבור ל-MySQL
2. ✅ יצירת בסיס נתונים וטבלה
3. ✅ INSERT - הוספת נתונים
4. ✅ SELECT - קריאת נתונים
5. ✅ WHERE - חיפוש וסינון
6. ✅ UPDATE - עדכון נתונים
7. ✅ DELETE - מחיקת נתונים
8. ✅ בניית API עם Express

---

## 🎓 תרגילים נוספים לתרגול

### תרגיל מתקדם 1: ספירה
צור קובץ שסופר כמה סטודנטים יש מעל גיל 25

### תרגיל מתקדם 2: ממוצע
חשב את הגיל הממוצע של כל הסטודנטים

### תרגיל מתקדם 3: מיון
הצג את הסטודנטים ממוינים לפי שם (A-Z)

### תרגיל מתקדם 4: LIMIT
הצג רק 3 סטודנטים ראשונים

### 💡 רמזים לתרגילים מתקדמים
<details>
<summary>רמז: ספירה</summary>

```sql
SELECT COUNT(*) as total FROM students WHERE age > 25
```
</details>

<details>
<summary>רמז: ממוצע</summary>

```sql
SELECT AVG(age) as avgAge FROM students
```
</details>

<details>
<summary>רמז: מיון</summary>

```sql
SELECT * FROM students ORDER BY name ASC
```
</details>

<details>
<summary>רמז: הגבלה</summary>

```sql
SELECT * FROM students LIMIT 3
```
</details>

---

## 🐛 שגיאות נפוצות ופתרונות

### שגיאה 1: Access denied
```
Error: Access denied for user 'root'@'localhost'
```
**פתרון:** בדוק שם משתמש וסיסמה ב-.env

### שגיאה 2: Unknown database
```
Error: Unknown database 'students_db'
```
**פתרון:** הרץ את create-db.js קודם

### שגיאה 3: Table doesn't exist
```
Error: Table 'students_db.students' doesn't exist
```
**פתרון:** הרץ את create-db.js כדי ליצור את הטבלה

### שגיאה 4: Cannot find module
```
Error: Cannot find module 'mysql2'
```
**פתרון:** `npm install mysql2`

---

## 📖 משאבים נוספים

- [מדריך MySQL המלא](../../guides/hebrew/mysql-guide.md)
- [מדריך Docker + MySQL](../../guides/hebrew/mysql-docker-guide.md)
- [תרגיל CRUD מתקדם](../../express_mysql_crud_exercise.md)

---

## 📖 פתרונות מלאים

<details>
<summary>פתרון תרגיל 1: התחברות</summary>

```javascript
import mysql from 'mysql2/promise';
import 'dotenv/config';

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log('✅ Successfully connected to MySQL!');

    const [rows] = await connection.query('SELECT VERSION() as version');
    console.log('MySQL Version:', rows[0].version);

    await connection.end();
    console.log('Connection closed successfully');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testConnection();
```
</details>

<details>
<summary>פתרון תרגיל 2: יצירת DB וטבלה</summary>

```javascript
import mysql from 'mysql2/promise';
import 'dotenv/config';

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await connection.query('CREATE DATABASE IF NOT EXISTS students_db');
    console.log('✅ Database students_db created');

    await connection.query('USE students_db');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        age INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table students created');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

createDatabase();
```
</details>

<details>
<summary>פתרון תרגיל 3: INSERT</summary>

```javascript
import mysql from 'mysql2/promise';
import 'dotenv/config';

async function insertStudent() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'students_db'
  });

  try {
    const [result] = await connection.query(
      'INSERT INTO students (name, age) VALUES (?, ?)',
      ['John Doe', 25]
    );

    console.log('✅ Student added successfully!');
    console.log('New student ID:', result.insertId);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

insertStudent();
```
</details>

<details>
<summary>פתרון תרגיל 4: SELECT</summary>

```javascript
import mysql from 'mysql2/promise';
import 'dotenv/config';

// insert-many.js
async function insertManyStudents() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'students_db'
  });

  try {
    const students = [
      ['Sarah Cohen', 22],
      ['Mike Wilson', 28],
      ['Emma Brown', 24]
    ];

    for (const [name, age] of students) {
      await connection.query(
        'INSERT INTO students (name, age) VALUES (?, ?)',
        [name, age]
      );
    }

    console.log('✅ All students added!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

// select.js
async function getStudents() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'students_db'
  });

  try {
    const [rows] = await connection.query('SELECT * FROM students');

    console.log('📚 Students List:');
    console.log('-------------------');
    
    rows.forEach(student => {
      console.log(`ID: ${student.id}`);
      console.log(`Name: ${student.name}`);
      console.log(`Age: ${student.age}`);
      console.log('-------------------');
    });

    console.log(`\nTotal: ${rows.length} students`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

getStudents();
```
</details>

<details>
<summary>פתרון תרגיל 5: WHERE</summary>

```javascript
import mysql from 'mysql2/promise';
import 'dotenv/config';

async function searchStudents() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'students_db'
  });

  try {
    console.log('🔍 Students over 23:');
    const [older] = await connection.query(
      'SELECT * FROM students WHERE age > ?',
      [23]
    );
    console.log(older);
    console.log('-------------------\n');

    console.log('🔍 Search by name "John Doe":');
    const [byName] = await connection.query(
      'SELECT * FROM students WHERE name = ?',
      ['John Doe']
    );
    console.log(byName);
    console.log('-------------------\n');

    console.log('🔍 Student with ID 1:');
    const [byId] = await connection.query(
      'SELECT * FROM students WHERE id = ?',
      [1]
    );
    console.log(byId[0]);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

searchStudents();
```
</details>

<details>
<summary>פתרון תרגיל 6: UPDATE</summary>

```javascript
import mysql from 'mysql2/promise';
import 'dotenv/config';

async function updateStudent() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'students_db'
  });

  try {
    const studentId = 1;
    const newAge = 26;

    const [result] = await connection.query(
      'UPDATE students SET age = ? WHERE id = ?',
      [newAge, studentId]
    );

    console.log('✅ Update completed!');
    console.log(`Rows updated: ${result.affectedRows}`);

    const [updated] = await connection.query(
      'SELECT * FROM students WHERE id = ?',
      [studentId]
    );
    
    console.log('\n📝 Updated info:');
    console.log(updated[0]);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

updateStudent();
```
</details>

<details>
<summary>פתרון תרגיל 7: DELETE</summary>

```javascript
import mysql from 'mysql2/promise';
import 'dotenv/config';

async function deleteStudent() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'students_db'
  });

  try {
    const studentId = 2;
    
    const [before] = await connection.query(
      'SELECT * FROM students WHERE id = ?',
      [studentId]
    );
    
    console.log('🗑️ Student to delete:');
    console.log(before[0]);
    console.log('-------------------');

    const [result] = await connection.query(
      'DELETE FROM students WHERE id = ?',
      [studentId]
    );

    console.log(`\n✅ Student deleted!`);
    console.log('Rows deleted:', result.affectedRows);

    const [after] = await connection.query(
      'SELECT * FROM students WHERE id = ?',
      [studentId]
    );

    if (after.length === 0) {
      console.log('✅ Verified: Student not found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

deleteStudent();
```
</details>

<details>
<summary>פתרון תרגיל 8: API מלא</summary>

```javascript
import express from 'express';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const app = express();
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'students_db',
  waitForConnections: true,
  connectionLimit: 10
});

// GET all students
app.get('/students', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET one student
app.get('/students/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM students WHERE id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - add student
app.post('/students', async (req, res) => {
  try {
    const { name, age } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO students (name, age) VALUES (?, ?)',
      [name, age]
    );
    
    res.status(201).json({
      message: 'Student added successfully',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - update student
app.put('/students/:id', async (req, res) => {
  try {
    const { name, age } = req.body;
    
    const [result] = await pool.query(
      'UPDATE students SET name = ?, age = ? WHERE id = ?',
      [name, age, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE student
app.delete('/students/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM students WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
```
</details>

<details>
<summary>פתרון תרגילים מתקדמים</summary>

```javascript
import mysql from 'mysql2/promise';
import 'dotenv/config';

async function advancedQueries() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'students_db'
  });

  try {
    // 1. Count students over 25
    const [count] = await connection.query(
      'SELECT COUNT(*) as total FROM students WHERE age > 25'
    );
    console.log('Students over 25:', count[0].total);

    // 2. Average age
    const [avg] = await connection.query(
      'SELECT AVG(age) as avgAge FROM students'
    );
    console.log('Average age:', avg[0].avgAge);

    // 3. Order by name
    const [ordered] = await connection.query(
      'SELECT * FROM students ORDER BY name ASC'
    );
    console.log('Students ordered by name:', ordered);

    // 4. Limit 3
    const [limited] = await connection.query(
      'SELECT * FROM students LIMIT 3'
    );
    console.log('First 3 students:', limited);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

advancedQueries();
```
</details>

---

**בהצלחה! 🚀**
