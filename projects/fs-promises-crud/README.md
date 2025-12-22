# 📂 File System Promises CRUD Project

פרויקט CRUD מלא עם שמירת נתונים קבועה בקבצי JSON באמצעות `fs/promises`.

## 📋 תיאור

זהו פרויקט ביניים שמדגים:
- ✅ שמירת נתונים קבועה בקבצים
- ✅ קריאה וכתיבה אסינכרונית עם `async/await`
- ✅ ניהול קבצי JSON מעוצבים
- ✅ טיפול בשגיאות קבצים (ENOENT)
- ✅ יצירה אוטומטית של תיקיות

## 🎯 למי זה מיועד?

- למי שסיים את הפרויקט הבסיסי (`simple-crud`)
- מי שרוצה ללמוד על שמירת נתונים
- מי שמעוניין לעבוד עם File System

## 🚀 התקנה והפעלה

### 1. התקן חבילות

```powershell
npm install
```

### 2. הפעל את השרת

```powershell
npm start
```

השרת ירוץ על http://localhost:3000

## 📚 מבנה הפרויקט

```
fs-promises-crud/
├── server.js         # השרת הראשי
├── package.json      # הגדרות הפרויקט
├── data/             # תיקייה לקבצים (נוצרת אוטומטית)
│   └── users.json    # קובץ המשתמשים
└── README.md         # המדריך הזה
```

## 🌐 נקודות קצה (Endpoints)

### 🏠 דף הבית
```powershell
curl http://localhost:3000/
```

מחזיר מידע על ה-API וסטטיסטיקות.

### 📖 קבל את כל המשתמשים
```powershell
# כל המשתמשים
curl http://localhost:3000/users

# עם פילטרים
curl "http://localhost:3000/users?search=john"
curl "http://localhost:3000/users?minAge=25"
curl "http://localhost:3000/users?minAge=20&maxAge=40"
```

**תשובה:**
```json
{
  "success": true,
  "count": 2,
  "totalCount": 2,
  "users": [...]
}
```

### 🔍 קבל משתמש ספציפי
```powershell
curl http://localhost:3000/users/1
```

**תשובה:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "city": "Tel Aviv",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

### ➕ צור משתמש חדש
```powershell
curl -X POST http://localhost:3000/users `
  -H "Content-Type: application/json" `
  -d '{
    \"name\": \"Jane Smith\",
    \"email\": \"jane@example.com\",
    \"age\": 28,
    \"city\": \"Jerusalem\"
  }'
```

**תשובה:**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "age": 28,
    "city": "Jerusalem",
    "createdAt": "2024-01-01T10:05:00.000Z",
    "updatedAt": "2024-01-01T10:05:00.000Z"
  }
}
```

### ✏️ עדכן משתמש
```powershell
curl -X PUT http://localhost:3000/users/1 `
  -H "Content-Type: application/json" `
  -d '{
    \"age\": 31,
    \"city\": \"Haifa\"
  }'
```

**תשובה:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 31,
    "city": "Haifa",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:10:00.000Z"
  }
}
```

### ❌ מחק משתמש
```powershell
curl -X DELETE http://localhost:3000/users/1
```

**תשובה:**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    ...
  }
}
```

### 📊 סטטיסטיקות
```powershell
curl http://localhost:3000/stats
```

**תשובה:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 5,
    "averageAge": 30,
    "cities": ["Tel Aviv", "Jerusalem", "Haifa"],
    "dataFile": "./data/users.json"
  }
}
```

## 💾 קובץ הנתונים

המידע נשמר בקובץ `data/users.json`:

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "city": "Tel Aviv",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
]
```

## 🔑 תכונות מרכזיות

### 1. שמירה קבועה
```javascript
// כל פעולה שומרת את הנתונים
await writeUsers(users);
```

### 2. יצירה אוטומטית של תיקייה
```javascript
async function ensureDataDirectory() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}
```

### 3. טיפול בקובץ חסר
```javascript
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // צור קובץ חדש
      await writeUsers([]);
      return [];
    }
    throw err;
  }
}
```

### 4. JSON מעוצב
```javascript
// שמירה עם פורמט יפה (2 רווחים)
JSON.stringify(users, null, 2)
```

## 🎓 מה לומדים כאן?

1. **File System Promises**
   - `fs.readFile()` - קריאת קבצים
   - `fs.writeFile()` - כתיבה לקבצים
   - `fs.mkdir()` - יצירת תיקיות

2. **Async/Await**
   - עבודה אסינכרונית נכונה
   - טיפול בשגיאות עם try/catch
   - ציון async לפונקציות

3. **JSON**
   - המרה מ-string ל-object עם `JSON.parse()`
   - המרה מ-object ל-string עם `JSON.stringify()`
   - פורמט יפה עם null, 2

4. **Timestamps**
   - תאריך יצירה: `createdAt`
   - תאריך עדכון: `updatedAt`
   - פורמט ISO: `new Date().toISOString()`

## ⚠️ שגיאות נפוצות

### ENOENT - קובץ לא נמצא
**פתרון:** הקוד מטפל בזה אוטומטית ויוצר קובץ חדש.

### JSON Parse Error
**פתרון:** בדוק שהקובץ מכיל JSON תקין.

### Permission Denied
**פתרון:** וודא שיש הרשאות כתיבה לתיקייה.

## 🔄 ההבדלים מהפרויקט הבסיסי

| תכונה | Basic (Array) | FS Promises (File) |
|-------|--------------|-------------------|
| שמירת נתונים | זיכרון בלבד | קובץ קבוע |
| נשאר אחרי הפסקה? | ❌ לא | ✅ כן |
| מורכבות | פשוט | בינוני |
| פונקציות קריאה/כתיבה | - | ✅ כן |
| timestamps | - | ✅ כן |

## 📖 למידה נוספת

1. **המדריכים:**
   - [מדריך fs.promises](../../guides/hebrew/fs-promises-guide.md)
   - [מדריך Params](../../guides/hebrew/params-guide.md)

2. **דוגמאות:**
   - [fs.promises דוגמה מלאה](../../examples/hebrew/fs-promises-example.js)

3. **תרגילים:**
   - [תרגילי fs.promises](../../exercises/hebrew/fs-promises-exercises.md)

## 🎯 אתגרים

נסו להוסיף:
1. ✅ מערכת backup אוטומטית
2. ✅ קובץ לוגים לכל פעולה
3. ✅ ניקוי משתמשים ישנים
4. ✅ ייצוא לפורמטים שונים (CSV)

## 🛠️ טיפים לפיתוח

### בדיקה מהירה
```powershell
# בדוק את הקובץ
Get-Content .\data\users.json

# מחק את הקובץ להתחלה מחדש
Remove-Item .\data\users.json
```

### צפייה בשינויים בזמן אמת
```powershell
npm run dev
```

זה ישתמש ב-`--watch` להפעלה מחדש אוטומטית.

## 🤝 תרומה

מצאת באג? יש רעיון לשיפור?
פתח issue או שלח pull request!

## 📄 רישיון

MIT License - חופשי לשימוש ולמידה!

---

**Happy Coding! 🚀**
