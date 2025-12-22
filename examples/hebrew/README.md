# 💻 Examples - דוגמאות קוד

## Hebrew / עברית

### [basic-server.js](basic-server.js)
שרת Express בסיסי עם פעולות CRUD פשוטות. כולל:
- ניתוב בסיסי
- GET, POST, PUT, DELETE
- מאגר נתונים פשוט (מערך)
- דוגמאות משתמשים

**איך להריץ:**
```bash
node basic-server.js
```

---

### [simple-fs-server.js](simple-fs-server.js)
שרת עם שמירת נתונים לקבצים (File System). כולל:
- קריאה וכתיבה לקבצים
- שמירת נתונים קבועה
- ניהול קבצי JSON

**איך להריץ:**
```bash
node simple-fs-server.js
```

---

### [params-examples.js](params-examples.js)
דוגמאות מעשיות לכל סוגי ה-Parameters:
- Route Parameters - `/users/:id`
- Query Parameters - `?age=25&city=TelAviv`
- Body Parameters - POST/PUT עם JSON
- Headers - Authorization, Content-Type
- סינון, מיון, pagination
- Validation מלא
- 15+ endpoints מוכנים

**איך להריץ:**
```bash
node params-examples.js
# עכשיו פתח: http://localhost:3000
```

**Endpoints לדוגמה:**
```
GET  /                              # רשימת כל ה-endpoints
GET  /users/:id                     # משתמש לפי ID
GET  /users?age=25&city=TelAviv     # סינון משתמשים
GET  /products?category=electronics # סינון מוצרים
POST /users                         # יצירת משתמש
PUT  /users/:id                     # עדכון משתמש
```

---

### [fs-promises-example.js](fs-promises-example.js)
דוגמה מלאה לעבודה עם File System Promises:
- CRUD מלא עם שמירה בקבצים
- מערכת Logging מתקדמת
- Backup אוטומטי כל 5 דקות
- ניקוי backups ישנים
- סטטיסטיקות ומידע על המערכת
- Error handling מקצועי
- 10+ endpoints מוכנים

**איך להריץ:**
```bash
node fs-promises-example.js
# עכשיו פתח: http://localhost:3000
```

**מה זה כולל:**
```
✅ שמירת משתמשים ב-JSON
✅ מערכת לוגים מלאה
✅ Backup אוטומטי
✅ סטטיסטיקות מערכת
✅ טיפול מקצועי בשגיאות
```

**Endpoints מרכזיים:**
```
GET    /              # מידע על ה-API
GET    /users         # כל המשתמשים
POST   /users         # צור משתמש
GET    /stats         # סטטיסטיקות
POST   /backup        # צור backup
GET    /logs          # הצג logs
```

---

### [middleware-examples.js](middleware-examples.js)
דוגמאות מקיפות ל-Middleware:
- Logger - תיעוד בקשות
- Request Timer - מדידת זמנים
- Authentication - אימות עם API Key
- Role-based Authorization - הרשאות
- Rate Limiter - הגבלת קצב (20/דקה)
- Validation - אימות נתונים
- File Logger - שמירה לקובץ
- Error Handler - טיפול בשגיאות

**איך להריץ:**
```bash
node middleware-examples.js
# עכשיו פתח: http://localhost:3000
```

**API Keys לדוגמה:**
```
key-123 → User
key-456 → Admin
key-789 → Moderator
```

**Endpoints:**
```
GET    /              # מידע על ה-API
GET    /profile       # דורש API Key
POST   /users         # דורש API Key + Validation
DELETE /users/:id     # רק Admin
GET    /stats         # Admin/Moderator
```

---

## איך להתחיל?

1. **התקן תלויות** (אם עדיין לא):
   ```bash
   npm install
   ```

2. **הרץ דוגמה**:
   ```bash
   node basic-server.js
   # או
   node params-examples.js
   ```

3. **בדוק בדפדפן**:
   - פתח: `http://localhost:3000`
   - לבקשות POST/PUT השתמש ב-Postman או Thunder Client

4. **התנסה**:
   - שנה את הקוד
   - הוסף endpoints חדשים
   - נסה ערכים שונים

---

## טיפים

💡 **דפדפן** - טוב לבקשות GET  
💡 **Postman** - מעולה לבדיקת POST/PUT/DELETE  
💡 **Thunder Client** - תוסף VS Code לבדיקת API  
💡 **Console.log** - הדפס משתנים כדי להבין מה קורה

---

**בהצלחה! 🚀**
