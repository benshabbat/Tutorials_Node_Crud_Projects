# 🎯 פרויקט CRUD פשוט למתחילים

פרויקט Node.js + Express פשוט ללמידה - ללא מסד נתונים!

## 📚 מה זה?

זה פרויקט CRUD (Create, Read, Update, Delete) בסיסי שמשתמש במערך פשוט לאחסון נתונים.
**מושלם למתחילים שרוצים להבין את היסודות!**

## 🎓 מה תלמד?

- ✅ איך ליצור שרת Express
- ✅ מהם routes ו-endpoints
- ✅ איך לקרוא ולכתוב JSON
- ✅ מהן פעולות CRUD
- ✅ איך לטפל בשגיאות בסיסיות

## 🚀 התחלה מהירה

### 1. התקן תלויות
```bash
npm install
```

### 2. הרץ את השרת
```bash
npm start
```

או עם auto-reload:
```bash
npm run dev
```

### 3. פתח בדפדפן
```
http://localhost:3000
```

## 📖 API Endpoints

### דף הבית
```
GET http://localhost:3000/
```
מחזיר מידע על ה-API וכל ה-endpoints.

---

### קבל את כל המשתמשים
```
GET http://localhost:3000/users
```

**תשובה:**
```json
{
  "success": true,
  "count": 3,
  "users": [
    { "id": 1, "name": "יוסי כהן", "email": "yossi@example.com", "age": 28 },
    { "id": 2, "name": "שרה לוי", "email": "sara@example.com", "age": 32 }
  ]
}
```

---

### קבל משתמש ספציפי
```
GET http://localhost:3000/users/1
```

**תשובה:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "יוסי כהן",
    "email": "yossi@example.com",
    "age": 28
  }
}
```

---

### צור משתמש חדש
```
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "אליס ג'ונסון",
  "email": "alice@example.com",
  "age": 30
}
```

**תשובה:**
```json
{
  "success": true,
  "message": "משתמש נוצר בהצלחה!",
  "user": {
    "id": 4,
    "name": "אליס ג'ונסון",
    "email": "alice@example.com",
    "age": 30
  }
}
```

---

### עדכן משתמש
```
PUT http://localhost:3000/users/1
Content-Type: application/json

{
  "name": "יוסי כהן - מעודכן",
  "age": 29
}
```

**תשובה:**
```json
{
  "success": true,
  "message": "משתמש עודכן בהצלחה!",
  "user": {
    "id": 1,
    "name": "יוסי כהן - מעודכן",
    "email": "yossi@example.com",
    "age": 29
  }
}
```

---

### מחק משתמש
```
DELETE http://localhost:3000/users/1
```

**תשובה:**
```json
{
  "success": true,
  "message": "משתמש נמחק בהצלחה!",
  "user": {
    "id": 1,
    "name": "יוסי כהן",
    "email": "yossi@example.com",
    "age": 28
  }
}
```

## 🧪 איך לבדוק?

### 1. דפדפן (GET בלבד)
פשוט פתח:
```
http://localhost:3000/users
```

### 2. PowerShell (כל הפעולות)

**GET - קבל משתמשים:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/users" -Method Get
```

**POST - צור משתמש:**
```powershell
$body = @{
    name = "אליס"
    email = "alice@example.com"
    age = 30
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/users" -Method Post -Body $body -ContentType "application/json"
```

**PUT - עדכן משתמש:**
```powershell
$body = @{
    name = "אליס - מעודכן"
    age = 31
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/users/4" -Method Put -Body $body -ContentType "application/json"
```

**DELETE - מחק משתמש:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/users/4" -Method Delete
```

### 3. VS Code Extension
התקן את **Thunder Client** או **REST Client** ובדוק דרכם.

## 💡 הבנת הקוד

### מבנה בסיסי
```javascript
import express from 'express';
const app = express();

// Middleware - קורא JSON
app.use(express.json());

// נתונים במערך
let users = [ ... ];

// Routes
app.get('/users', (req, res) => { ... });
app.post('/users', (req, res) => { ... });
```

### פעולות CRUD

1. **CREATE** - `POST /users` - יוצר משתמש חדש
2. **READ** - `GET /users` - קורא נתונים
3. **UPDATE** - `PUT /users/:id` - מעדכן משתמש
4. **DELETE** - `DELETE /users/:id` - מוחק משתמש

### Status Codes
- `200` - הצלחה
- `201` - נוצר בהצלחה
- `400` - בקשה לא תקינה
- `404` - לא נמצא
- `409` - קונפליקט (כפילות)

## ⚠️ חשוב לדעת

### זה פרויקט לימודי!
- ✅ מושלם ללמידה
- ❌ הנתונים לא נשמרים (רק בזיכרון)
- ❌ אין אבטחה
- ❌ לא מתאים לפרודקשן

### הצעד הבא
אחרי שתבין את הפרויקט הזה:
1. עבור לפרויקט עם **fs-promises** (שמירה בקבצים)
2. למד על **MongoDB** (מסד נתונים אמיתי)
3. הוסף **Authentication** (אימות משתמשים)

## 🎯 תרגילים להרחבה

נסה להוסיף לבד:

1. **חיפוש** - `GET /users?name=יוסי`
2. **מיון** - `GET /users?sortBy=age`
3. **Validation** - בדיקת אימייל תקין
4. **ספירת משתמשים** - `GET /users/count`
5. **איפוס נתונים** - `DELETE /users/all`

## 📚 משאבים

- [Express Documentation](https://expressjs.com/)
- [MDN - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Node.js Documentation](https://nodejs.org/docs/)

## 🤝 עזרה

נתקלת בבעיה? בדוק:
1. Node.js מותקן? `node --version`
2. התקנת את התלויות? `npm install`
3. השרת רץ? בדוק את הטרמינל
4. הכתובת נכונה? `http://localhost:3000`

---

**בהצלחה! 🚀**

זה הפרויקט הראשון שלך - תהנה ממנו ולמד הרבה!
