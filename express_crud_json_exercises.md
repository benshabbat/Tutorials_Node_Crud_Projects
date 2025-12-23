# תרגילים ב-Express.js - רמה מתחילה מאוד
## CRUD + Parameters + קבצי JSON

## הגדרות התחלתיות

```bash
npm init -y
npm install express
```

**הוסיפו ל-package.json:**
```json
{
  "type": "module"
}
```

---

## תרגיל 1: שרת בסיסי + קריאת JSON

**מטרה:** ליצור שרת שקורא נתונים מקובץ JSON

### שלב א': הכנת קובץ JSON

צרו קובץ `users.json`:
```json
[
  { "id": 1, "name": "David", "age": 25, "city": "Tel Aviv" },
  { "id": 2, "name": "Sarah", "age": 30, "city": "Jerusalem" },
  { "id": 3, "name": "Michael", "age": 28, "city": "Haifa" }
]
```

### שלב ב': קוד התחלתי

```javascript
import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;

// TODO: צרו route שקורא את users.json ומחזיר את כל המשתמשים
// GET /users


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**מה צריך לעשות:**
1. צרו route `GET /users`
2. קראו את הקובץ `users.json` עם `fs.readFile`
3. המירו את התוכן ל-JSON עם `JSON.parse`
4. החזירו את המערך עם `res.json()`

**רמז:** 
```javascript
const data = await fs.readFile('users.json', 'utf-8');
const users = JSON.parse(data);
```

---

## תרגיל 2: קבלת משתמש לפי ID (Route Parameter)

**מטרה:** לקרוא משתמש ספציפי לפי ID

### קוד התחלתי:

```javascript
import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;

// TODO: צרו route שמחזיר משתמש לפי ID
// GET /users/:id


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**מה צריך לעשות:**
1. צרו route `GET /users/:id`
2. קראו את הקובץ `users.json`
3. מצאו את המשתמש עם ה-ID המבוקש (השתמשו ב-`find`)
4. אם נמצא - החזירו אותו
5. אם לא נמצא - החזירו שגיאה 404

**רמזים:**
```javascript
const id = parseInt(req.params.id);
const user = users.find(u => u.id === id);

if (!user) {
  return res.status(404).json({ message: 'User not found' });
}
```

**בדיקה:**
- `http://localhost:3000/users/1` - צריך להחזיר את David
- `http://localhost:3000/users/999` - צריך להחזיר 404

---

## תרגיל 3: חיפוש עם Query Parameters

**מטרה:** לסנן משתמשים לפי עיר

### קוד התחלתי:

```javascript
import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;

// TODO: צרו route שמחפש משתמשים לפי עיר
// GET /users/search?city=TelAviv


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**מה צריך לעשות:**
1. צרו route `GET /users/search`
2. קראו את הפרמטר `city` מ-`req.query`
3. סננו את המשתמשים לפי העיר (השתמשו ב-`filter`)
4. החזירו את התוצאות

**רמז:**
```javascript
const city = req.query.city;
const filtered = users.filter(u => u.city === city);
```

**בדיקה:**
- `http://localhost:3000/users/search?city=Tel Aviv`
- `http://localhost:3000/users/search?city=Haifa`

---

## תרגיל 4: הוספת משתמש חדש (CREATE)

**מטרה:** להוסיף משתמש חדש ולשמור בקובץ

### קוד התחלתי:

```javascript
import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;

app.use(express.json());

// TODO: צרו route להוספת משתמש
// POST /users


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**מה צריך לעשות:**
1. צרו route `POST /users`
2. קראו את הקובץ הקיים
3. צרו משתמש חדש עם ID אוטומטי (מקסימום ID + 1)
4. הוסיפו אותו למערך
5. שמרו בחזרה לקובץ עם `fs.writeFile`
6. החזירו את המשתמש החדש עם status 201

**רמזים:**
```javascript
// מציאת ID הבא
const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
const newUser = {
  id: maxId + 1,
  ...req.body
};

// שמירה לקובץ
await fs.writeFile('users.json', JSON.stringify(users, null, 2));
```

**בדיקה עם curl:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Yael","age":27,"city":"Netanya"}'
```

---

## תרגיל 5: עדכון משתמש (UPDATE)

**מטרה:** לעדכן פרטי משתמש קיים

### קוד התחלתי:

```javascript
import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;

app.use(express.json());

// TODO: צרו route לעדכון משתמש
// PUT /users/:id


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**מה צריך לעשות:**
1. צרו route `PUT /users/:id`
2. קראו את הקובץ
3. מצאו את המשתמש לפי ID
4. עדכנו את הפרטים שלו
5. שמרו בחזרה לקובץ
6. החזירו את המשתמש המעודכן

**רמז:**
```javascript
const index = users.findIndex(u => u.id === id);

if (index === -1) {
  return res.status(404).json({ message: 'User not found' });
}

users[index] = { id, ...req.body };
```

**בדיקה:**
```bash
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"David Cohen","age":26,"city":"Tel Aviv"}'
```

---

## תרגיל 6: מחיקת משתמש (DELETE)

**מטרה:** למחוק משתמש מהקובץ

### קוד התחלתי:

```javascript
import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;

app.use(express.json());

// TODO: צרו route למחיקת משתמש
// DELETE /users/:id


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**מה צריך לעשות:**
1. צרו route `DELETE /users/:id`
2. קראו את הקובץ
3. סננו את המערך בלי המשתמש הנמחק (השתמשו ב-`filter`)
4. שמרו בחזרה לקובץ
5. החזירו הודעת הצלחה

**רמז:**
```javascript
const filteredUsers = users.filter(u => u.id !== id);

if (filteredUsers.length === users.length) {
  return res.status(404).json({ message: 'User not found' });
}
```

**בדיקה:**
```bash
curl -X DELETE http://localhost:3000/users/2
```

---

## תרגיל 7: CRUD מלא - מערכת משימות

**מטרה:** לבנות API מלא לניהול משימות

### הכנה: צרו קובץ `tasks.json`

```json
[
  { "id": 1, "title": "לקנות חלב", "completed": false, "priority": "high" },
  { "id": 2, "title": "לסיים תרגיל", "completed": false, "priority": "medium" }
]
```

### קוד התחלתי:

```javascript
import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper function לקריאת משימות
async function readTasks() {
  const data = await fs.readFile('tasks.json', 'utf-8');
  return JSON.parse(data);
}

// Helper function לשמירת משימות
async function writeTasks(tasks) {
  await fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2));
}

// TODO: 1. GET /tasks - קבלת כל המשימות


// TODO: 2. GET /tasks/:id - קבלת משימה ספציפית


// TODO: 3. GET /tasks/filter?completed=true - סינון לפי completed


// TODO: 4. GET /tasks/filter?priority=high - סינון לפי priority


// TODO: 5. POST /tasks - הוספת משימה חדשה


// TODO: 6. PUT /tasks/:id - עדכון משימה


// TODO: 7. PATCH /tasks/:id/toggle - שינוי סטטוס completed


// TODO: 8. DELETE /tasks/:id - מחיקת משימה


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### דרישות מפורטות:

#### 1. GET /tasks
- החזירו את כל המשימות

#### 2. GET /tasks/:id
- החזירו משימה ספציפית
- 404 אם לא נמצאה

#### 3. GET /tasks/filter?completed=true
- סננו משימות לפי `completed`
- תמיכה ב-`true` או `false`

#### 4. GET /tasks/filter?priority=high
- סננו משימות לפי `priority`
- ערכים אפשריים: `high`, `medium`, `low`

#### 5. POST /tasks
- הוסיפו משימה חדשה
- ID אוטומטי
- `completed` ברירת מחדל: `false`
- status 201

#### 6. PUT /tasks/:id
- עדכנו כל הפרטים של המשימה
- 404 אם לא נמצאה

#### 7. PATCH /tasks/:id/toggle
- הפכו את ה-`completed` (true ↔ false)
- 404 אם לא נמצאה

#### 8. DELETE /tasks/:id
- מחקו משימה
- 404 אם לא נמצאה

---

## תרגיל 8: פרויקט מורכב יותר - מערכת מוצרים

**מטרה:** API למוצרים עם קטגוריות ומחירים

### הכנה: צרו קובץ `products.json`

```json
[
  { "id": 1, "name": "Laptop", "price": 3000, "category": "electronics", "stock": 5 },
  { "id": 2, "name": "Mouse", "price": 50, "category": "electronics", "stock": 20 },
  { "id": 3, "name": "Chair", "price": 500, "category": "furniture", "stock": 10 }
]
```

### קוד התחלתי:

```javascript
import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;

app.use(express.json());

async function readProducts() {
  const data = await fs.readFile('products.json', 'utf-8');
  return JSON.parse(data);
}

async function writeProducts(products) {
  await fs.writeFile('products.json', JSON.stringify(products, null, 2));
}

// TODO: יישמו את כל ה-endpoints


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### דרישות:

#### CRUD בסיסי:
1. `GET /products` - כל המוצרים
2. `GET /products/:id` - מוצר ספציפי
3. `POST /products` - הוספת מוצר
4. `PUT /products/:id` - עדכון מוצר
5. `DELETE /products/:id` - מחיקת מוצר

#### חיפוש וסינון (Query Parameters):
6. `GET /products/search?category=electronics` - סינון לפי קטגוריה
7. `GET /products/search?minPrice=100&maxPrice=1000` - סינון לפי טווח מחירים
8. `GET /products/search?name=laptop` - חיפוש לפי שם (חלקי)

#### פעולות מיוחדות:
9. `PATCH /products/:id/stock` - עדכון מלאי (הוספה או הפחתה)
   - Body: `{ "quantity": 5 }` (מספר חיובי להוספה, שלילי להפחתה)
10. `GET /products/low-stock?threshold=10` - מוצרים עם מלאי נמוך

---

## טיפים חשובים

### 1. קריאת קובץ JSON
```javascript
const data = await fs.readFile('file.json', 'utf-8');
const array = JSON.parse(data);
```

### 2. כתיבת קובץ JSON
```javascript
await fs.writeFile('file.json', JSON.stringify(array, null, 2));
```

### 3. מציאת ID הבא
```javascript
const maxId = array.length > 0 ? Math.max(...array.map(item => item.id)) : 0;
const newId = maxId + 1;
```

### 4. Route Parameters
```javascript
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  // ...
});
```

### 5. Query Parameters
```javascript
app.get('/search', (req, res) => {
  const city = req.query.city;
  const age = req.query.age;
  // ...
});
```

### 6. Body מ-POST/PUT
```javascript
app.post('/users', (req, res) => {
  const newUser = req.body;
  // ...
});
```

### 7. סינון מערך
```javascript
const filtered = array.filter(item => item.property === value);
```

### 8. מציאת אלמנט
```javascript
const found = array.find(item => item.id === id);
```

### 9. מציאת אינדקס
```javascript
const index = array.findIndex(item => item.id === id);
```

### 10. מחיקה ממערך
```javascript
const filtered = array.filter(item => item.id !== idToDelete);
```

---

## בדיקת ה-API

### דרך 1: דפדפן (רק GET)
פשוט פתחו: `http://localhost:3000/users`

### דרך 2: curl (Terminal)
```bash
# GET
curl http://localhost:3000/users

# POST
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","age":30,"city":"Test City"}'

# PUT
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated","age":31,"city":"New City"}'

# DELETE
curl -X DELETE http://localhost:3000/users/1
```

### דרך 3: VS Code Extension
התקינו **Thunder Client** או **REST Client**

---

## שאלות נפוצות

**ש: הקובץ לא נמצא?**  
ת: וודאו שהקובץ JSON נמצא באותה תיקייה כמו server.js

**ש: השרת קורס?**  
ת: בדקו שיש `await` לפני `fs.readFile` ו-`fs.writeFile`

**ש: המידע לא נשמר?**  
ת: וודאו שקראתם את הקובץ לפני עדכון ושמרתם אחרי

**ש: שגיאת JSON?**  
ת: בדקו שהקובץ JSON תקין (השתמשו ב-JSON validator)

**ש: 404 על הכל?**  
ת: בדקו שה-routes מוגדרים לפני `app.listen()`

בהצלחה! 🚀
