# 📦 Simple MySQL CRUD - כל הקוד בקובץ אחד

פרויקט CRUD פשוט עם MySQL - כל הקוד בקובץ `server.js` אחד.  
מושלם למתחילים ולהבנת הבסיס!

## 🎯 מה יש בפרויקט?

- ✅ **Express.js Server** - שרת אפליקציה
- ✅ **MySQL Database** - מסד נתונים יחסי
- ✅ **CRUD מלא** - Create, Read, Update, Delete
- ✅ **Connection Pool** - ניהול חיבורים יעיל
- ✅ **Validation** - וולידציה בסיסית
- ✅ **Error Handling** - טיפול בשגיאות
- ✅ **ES Modules** - תחביר מודרני

## 📋 דרישות

- Node.js גרסה 18 ומעלה
- MySQL Server מותקן ופועל
- npm או yarn

## 🚀 התקנה והרצה

### 1. התקנת תלויות
```bash
npm install
```

### 2. הגדרת MySQL

התחבר ל-MySQL וצור מסד נתונים:
```sql
CREATE DATABASE simple_crud_db;
USE simple_crud_db;
```

הטבלה תיווצר אוטומטית בהרצה הראשונה!

### 3. הגדרת משתני סביבה

העתק את `.env.example` ל-`.env`:
```bash
cp .env.example .env
```

ערוך את `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=simple_crud_db
DB_PORT=3306
PORT=3000
```

### 4. הפעלת השרת

```bash
npm start
```

או במצב פיתוח (עם auto-reload):
```bash
npm run dev
```

## 📚 API Endpoints

### 🏠 Welcome
```http
GET /
```

### 📊 סטטיסטיקות
```http
GET /api/stats
```

### 📖 קבלת כל המשתמשים
```http
GET /api/users
```

**תגובה:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "דני כהן",
      "email": "danny@example.com",
      "age": 25,
      "created_at": "2024-01-01T10:00:00.000Z",
      "updated_at": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

### 📖 קבלת משתמש לפי ID
```http
GET /api/users/:id
```

### ➕ הוספת משתמש חדש
```http
POST /api/users
Content-Type: application/json

{
  "name": "דני כהן",
  "email": "danny@example.com",
  "age": 25
}
```

### ✏️ עדכון משתמש
```http
PUT /api/users/:id
Content-Type: application/json

{
  "name": "דני כהן",
  "email": "danny@example.com",
  "age": 26
}
```

### 🗑️ מחיקת משתמש
```http
DELETE /api/users/:id
```

## 🧪 בדיקה עם cURL

### הוספת משתמש:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"דני כהן","email":"danny@example.com","age":25}'
```

### קבלת כל המשתמשים:
```bash
curl http://localhost:3000/api/users
```

### עדכון משתמש:
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"דני כהן","email":"danny@example.com","age":26}'
```

### מחיקת משתמש:
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

## 📁 מבנה הפרויקט

```
simple-mysql-crud/
├── server.js          # כל הקוד כאן!
├── package.json       # תלויות והגדרות
├── .env.example       # דוגמה למשתני סביבה
├── .env              # משתני סביבה (אל תשתף!)
├── .gitignore        # קבצים להתעלם
└── README.md         # המדריך הזה
```

## 🔒 אבטחה

- ✅ Prepared Statements - הגנה מפני SQL Injection
- ✅ משתני סביבה - לא חושף סיסמאות בקוד
- ✅ וולידציה - בדיקת קלט מהמשתמש
- ✅ Error Handling - לא חושף מידע רגיש בשגיאות

## ⚠️ שגיאות נפוצות

### שגיאת חיבור למסד נתונים
```
❌ שגיאה בחיבור למסד נתונים
```
**פתרון:**
1. וודא ש-MySQL רץ
2. בדוק את הגדרות החיבור ב-`.env`
3. וודא שמסד הנתונים קיים

### אימייל כבר קיים
```json
{
  "success": false,
  "error": "אימייל כבר קיים במערכת"
}
```
**פתרון:** השתמש באימייל אחר

## 🎓 למה זה מתאים?

- ✅ **למתחילים** - קל להבין, הכל בקובץ אחד
- ✅ **ללמידה** - רואים את כל התהליך
- ✅ **לפרויקטים קטנים** - פשוט ומהיר
- ✅ **לאב-טיפוס** - מתחילים מהר

## ➡️ הצעדים הבאים

רוצה לשפר? עבור לפרויקט המודולרי:
- 📂 `modular-mysql-crud` - ארגון מקצועי
- קוד מסודר בתיקיות: models, controllers, routes
- קל יותר לתחזוקה ולהרחבה

## 📝 לקריאה נוספת

- [מדריך MySQL](../../guides/hebrew/mysql-guide.md)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [mysql2 Package](https://www.npmjs.com/package/mysql2)

---

**בהצלחה! 🚀**

נתקעת? יש שאלות? תבדוק את המדריכים בתיקיית `guides/`
