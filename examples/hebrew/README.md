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
