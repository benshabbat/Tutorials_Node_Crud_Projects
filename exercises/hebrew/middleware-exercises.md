# 🎯 תרגילים - Middleware

## 📋 הוראות

1. צור תיקייה חדשה לכל תרגיל
2. התקן Express: `npm install express`
3. הוסף `"type": "module"` ל-package.json
4. נסה לכתוב את הקוד לבד לפני שמסתכלים על פתרון
5. בדוק שהכל עובד

---

## תרגיל 1️⃣ - Logger בסיסי

### משימה
צור middleware שמתעד כל בקשה שמגיעה לשרת.

### דרישות
- ✅ הצג את השעה, Method, ו-URL
- ✅ הפעל על כל הבקשות
- ✅ צבע שונה לכל method (אופציונלי)

### דוגמת פלט
```
[2025-12-22T10:30:00.000Z] GET /users
[2025-12-22T10:30:05.000Z] POST /users
[2025-12-22T10:30:10.000Z] DELETE /users/1
```

### בונוס
- הוסף צבעים: GET=ירוק, POST=כחול, DELETE=אדום
- הצג גם IP של המבקש
- שמור ללוג בקובץ

<details>
<summary>💡 רמז</summary>

```javascript
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

app.use(logger);
```
</details>

---

## תרגיל 2️⃣ - API Key Authentication

### משימה
צור middleware שבודק API Key בheaders.

### דרישות
- ✅ בדוק אם קיים header בשם `x-api-key`
- ✅ אם אין - החזר 401 עם הודעה מתאימה
- ✅ אם יש אבל לא נכון - החזר 403
- ✅ אם נכון - המשך לendpoint הבא

### API Keys תקינים
```javascript
const validKeys = {
  'key-abc123': { id: 1, name: 'User One' },
  'key-xyz789': { id: 2, name: 'User Two' }
};
```

### Endpoints
```javascript
GET  /public       // ללא הגנה
GET  /private      // דורש API Key
```

### בונוס
- שמור את פרטי המשתמש ב-`req.user`
- הוסף endpoint `/profile` שמציג את פרטי המשתמש

<details>
<summary>💡 רמז</summary>

```javascript
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API Key חסר' });
  }
  
  const user = validKeys[apiKey];
  if (!user) {
    return res.status(403).json({ error: 'API Key לא תקין' });
  }
  
  req.user = user;
  next();
};
```
</details>

---

## תרגיל 3️⃣ - Request Timer

### משימה
צור middleware שמודד כמה זמן לוקח לכל בקשה.

### דרישות
- ✅ שמור את זמן התחלת הבקשה
- ✅ אחרי שהתשובה נשלחת, הצג את הזמן שעבר
- ✅ הצג ב-milliseconds

### דוגמת פלט
```
⏱️  בקשה ל-/users לקחה 45ms
⏱️  בקשה ל-/products לקחה 120ms
```

### בונוס
- הוסף אזהרה אם בקשה לוקחת יותר מ-1000ms
- שמור סטטיסטיקות של זמני תגובה ממוצעים

<details>
<summary>💡 רמז</summary>

```javascript
const requestTimer = (req, res, next) => {
  req.startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    console.log(`⏱️  בקשה ל-${req.url} לקחה ${duration}ms`);
  });
  
  next();
};
```
</details>

---

## תרגיל 4️⃣ - Validation Middleware

### משימה
צור middleware שמאמת נתוני משתמש לפני יצירה.

### דרישות
- ✅ בדוק שיש שם (לפחות 2 תווים)
- ✅ בדוק שיש אימייל תקין (עם @)
- ✅ בדוק שגיל בין 0 ל-150 (אם נשלח)
- ✅ החזר 400 עם רשימת שגיאות אם לא תקין

### דוגמת נתונים
```json
{
  "name": "ישראל",
  "email": "israel@example.com",
  "age": 30
}
```

### בונוס
- הוסף בדיקת טלפון (פורמט ישראלי)
- הוסף בדיקה שהאימייל לא קיים כבר
- צור middleware נפרד לכל שדה

<details>
<summary>💡 רמז</summary>

```javascript
const validateUser = (req, res, next) => {
  const { name, email, age } = req.body;
  const errors = [];
  
  if (!name || name.length < 2) {
    errors.push('שם לא תקין');
  }
  
  if (!email || !email.includes('@')) {
    errors.push('אימייל לא תקין');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  
  next();
};
```
</details>

---

## תרגיל 5️⃣ - Rate Limiter

### משימה
צור middleware שמגביל מספר בקשות לדקה.

### דרישות
- ✅ אפשר מקסימום 5 בקשות לדקה לכל IP
- ✅ אם עבר את הגבול - החזר 429
- ✅ הצג בתשובה כמה זמן לחכות

### דוגמת תשובה
```json
{
  "error": "יותר מדי בקשות",
  "retryAfter": 45
}
```

### בונוס
- הוסף header `Retry-After` לתשובה
- הוסף סטטיסטיקות כמה בקשות נותרו
- אפשר הגדרות שונות לendpoints שונים

<details>
<summary>💡 רמז</summary>

```javascript
const requestCounts = {};

const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const limit = 5;
  const window = 60000; // דקה
  
  if (!requestCounts[ip]) {
    requestCounts[ip] = { count: 1, resetTime: now + window };
    return next();
  }
  
  if (now > requestCounts[ip].resetTime) {
    requestCounts[ip] = { count: 1, resetTime: now + window };
    return next();
  }
  
  if (requestCounts[ip].count >= limit) {
    return res.status(429).json({ 
      error: 'יותר מדי בקשות' 
    });
  }
  
  requestCounts[ip].count++;
  next();
};
```
</details>

---

## תרגיל 6️⃣ - Role-Based Authorization

### משימה
צור middleware שבודק הרשאות לפי תפקיד.

### דרישות
- ✅ הנח שיש `req.user.role`
- ✅ צור middleware שמקבל רשימת תפקידים מותרים
- ✅ אם המשתמש לא מורשה - החזר 403

### תפקידים
- `user` - משתמש רגיל
- `moderator` - מנהל תוכן
- `admin` - מנהל מערכת

### דוגמת שימוש
```javascript
app.delete('/users/:id', 
  authenticate,
  requireRole('admin'),
  deleteUserHandler
);

app.get('/stats',
  authenticate,
  requireRole('admin', 'moderator'),
  getStatsHandler
);
```

### בונוס
- הוסף הודעה מפורטת איזה תפקיד נדרש
- צור middleware ל-permissions ספציפיות

<details>
<summary>💡 רמז</summary>

```javascript
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'אימות נדרש' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'אין הרשאה',
        required: allowedRoles,
        current: req.user.role
      });
    }
    
    next();
  };
};
```
</details>

---

## תרגיל 7️⃣ - Request Logger to File

### משימה
צור middleware ששומר לוגים לקובץ.

### דרישות
- ✅ שמור כל בקשה לקובץ `logs/requests.log`
- ✅ שמור בפורמט JSON
- ✅ כלול: timestamp, method, url, ip
- ✅ צור את תיקיית logs אם לא קיימת

### פורמט הלוג
```json
{"timestamp":"2025-12-22T10:30:00.000Z","method":"GET","url":"/users","ip":"::1"}
{"timestamp":"2025-12-22T10:30:05.000Z","method":"POST","url":"/users","ip":"::1"}
```

### בונוס
- הוסף rotation - קובץ חדש כל יום
- נקה לוגים ישנים (יותר מ-7 ימים)
- הוסף endpoint `/logs` לצפייה

<details>
<summary>💡 רמז</summary>

```javascript
import fs from 'fs/promises';

const fileLogger = async (req, res, next) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    ip: req.ip
  };
  
  try {
    await fs.mkdir('./logs', { recursive: true });
    await fs.appendFile('./logs/requests.log', JSON.stringify(logEntry) + '\n');
  } catch (err) {
    console.error('Error saving log:', err);
  }
  
  next();
};
```
</details>

---

## תרגיל 8️⃣ - Error Handler Middleware

### משימה
צור middleware לטיפול בשגיאות.

### דרישות
- ✅ תפוס כל שגיאה שנזרקת
- ✅ הצג הודעה ידידותית למשתמש
- ✅ לוג את השגיאה המלאה ל-console
- ✅ החזר 500 אם אין status code

### פורמט תשובה
```json
{
  "error": "שגיאה בשרת",
  "message": "הודעת השגיאה",
  "timestamp": "2025-12-22T10:30:00.000Z"
}
```

### בונוס
- הסתר פרטים רגישים בproduction
- שמור שגיאות לקובץ
- שלח התראה באימייל לשגיאות קריטיות

<details>
<summary>💡 רמז</summary>

```javascript
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  
  res.status(err.status || 500).json({
    error: 'שגיאה בשרת',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});
```
</details>

---

## תרגיל 9️⃣ - Body Size Limiter

### משימה
צור middleware שמגביל גודל של request body.

### דרישות
- ✅ הגבל ל-1MB
- ✅ אם גדול יותר - החזר 413 (Payload Too Large)
- ✅ הצג את הגודל שנשלח והמקסימום

### דוגמת תשובה
```json
{
  "error": "Request גדול מדי",
  "size": "2.5 MB",
  "maxSize": "1 MB"
}
```

### בונוס
- תמיכה בהגדרות שונות לendpoints שונים
- ספור גם את גודל הheaders
- הוסף סטטיסטיקות של גודלים ממוצעים

---

## תרגיל 🔟 - Mini Project: Blog API עם Middleware

### משימה
בנה API מלא לבלוג עם כל ה-Middleware שלמדת.

### דרישות

#### Middleware שצריך
- ✅ Logger
- ✅ Authentication (API Key)
- ✅ Role-based Authorization
- ✅ Rate Limiter (10 בקשות/דקה)
- ✅ Validation
- ✅ Error Handler

#### Endpoints

**Posts:**
```javascript
GET    /posts              // כולם - רשימת פוסטים
GET    /posts/:id          // כולם - פוסט ספציפי
POST   /posts              // מחובר - יצירת פוסט
PUT    /posts/:id          // מחבר/מנהל - עדכון פוסט
DELETE /posts/:id          // רק מנהל - מחיקת פוסט
```

**Users:**
```javascript
GET    /users              // כולם - רשימת משתמשים
GET    /profile            // מחובר - הפרופיל שלי
PUT    /profile            // מחובר - עדכון פרופיל
DELETE /users/:id          // רק מנהל - מחיקת משתמש
```

**Admin:**
```javascript
GET    /admin/stats        // רק מנהל - סטטיסטיקות
GET    /admin/logs         // רק מנהל - צפייה בלוגים
```

#### מודלים

**Post:**
```javascript
{
  id: 1,
  title: "כותרת",
  content: "תוכן הפוסט",
  author: "שם המחבר",
  authorId: 1,
  createdAt: "2025-12-22T10:30:00.000Z",
  updatedAt: "2025-12-22T10:30:00.000Z"
}
```

**User:**
```javascript
{
  id: 1,
  name: "משתמש",
  email: "user@example.com",
  role: "user", // user, moderator, admin
  apiKey: "key-123"
}
```

### בונוס
- הוסף comments לפוסטים
- הוסף likes/views לפוסטים
- הוסף חיפוש ו-pagination
- שמור בקבצים עם fs/promises
- הוסף תמונות לפוסטים

---

## 📚 טיפים

1. **התחל פשוט** - תרגיל אחד בכל פעם
2. **בדוק בכלי** - Postman / Thunder Client / curl
3. **הדפס ל-console** - `console.log()` הוא החבר שלך
4. **קרא שגיאות** - הן אומרות לך בדיוק מה לא בסדר
5. **התנסה** - שנה ערכים, שבור דברים, למד

## 🎯 מסלול מומלץ

1. **למד** → קרא [`guides/hebrew/middleware-guide.md`](../../guides/hebrew/middleware-guide.md)
2. **ראה דוגמה** → הרץ [`examples/hebrew/middleware-examples.js`](../../examples/hebrew/middleware-examples.js)
3. **תרגל** → עשה תרגילים 1-8
4. **בנה פרויקט** → תרגיל 10 - Blog API מלא
5. **שפר** → הוסף features משלך!

---

**בהצלחה! 💪🚀**
