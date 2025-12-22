# 🎯 תרגילים - File System Promises

## 📋 הוראות

1. צור תיקייה חדשה לכל תרגיל
2. התקן Express: `npm install express`
3. הוסף `"type": "module"` ל-package.json
4. כתוב את הקוד לבד לפני שמסתכלים על הפתרון
5. הרץ ובדוק שהכל עובד

---

## תרגיל 1️⃣ - ספר טלפונים בסיסי

### משימה
צור API לניהול אנשי קשר עם הפעולות הבאות:

```javascript
GET    /contacts         // קבל את כל אנשי הקשר
GET    /contacts/:id     // קבל איש קשר ספציפי
POST   /contacts         // הוסף איש קשר חדש
PUT    /contacts/:id     // עדכן איש קשר
DELETE /contacts/:id     // מחק איש קשר
```

### מבנה איש קשר
```json
{
  "id": 1,
  "name": "יוסי כהן",
  "phone": "050-1234567",
  "email": "yossi@example.com",
  "address": "רחוב הרצל 10, תל אביב"
}
```

### דרישות
- ✅ שמירה בקובץ `contacts.json`
- ✅ Validation על טלפון (חייב להתחיל ב-05)
- ✅ Validation על אימייל (חייב להכיל @)
- ✅ אסור לאפשר טלפונים כפולים

### בונוס
- חיפוש לפי שם: `GET /contacts?search=יוסי`
- סינון לפי עיר בכתובת

---

## תרגיל 2️⃣ - מערכת משימות (To-Do List)

### משימה
צור API לניהול משימות עם מעקב אחרי סטטוס.

### Endpoints
```javascript
GET    /tasks                    // כל המשימות
GET    /tasks/:id                // משימה ספציפית
POST   /tasks                    // צור משימה
PUT    /tasks/:id                // עדכן משימה
DELETE /tasks/:id                // מחק משימה
PATCH  /tasks/:id/complete       // סמן כהושלמה
GET    /tasks/stats              // סטטיסטיקות
```

### מבנה משימה
```json
{
  "id": 1,
  "title": "לסיים פרויקט",
  "description": "להשלים את הפרויקט עד סוף השבוע",
  "status": "pending",  // pending, in-progress, completed
  "priority": "high",   // low, medium, high
  "dueDate": "2025-12-31",
  "createdAt": "2025-12-22T10:00:00.000Z",
  "completedAt": null
}
```

### דרישות
- ✅ שמירה בקובץ `tasks.json`
- ✅ סינון לפי status: `GET /tasks?status=pending`
- ✅ מיון לפי priority
- ✅ כשמסמנים complete, להוסיף `completedAt`

### בונוס
- סטטיסטיקות: כמה משימות בכל סטטוס
- התראה למשימות שעברו את dueDate
- ייצוא למשימות ל-CSV

---

## תרגיל 3️⃣ - מערכת לוגים מתקדמת

### משימה
צור מערכת שמתעדת כל פעולה בשרת.

### מה לרשום
```javascript
{
  "timestamp": "2025-12-22T10:30:00.000Z",
  "level": "info",  // info, warning, error
  "action": "USER_LOGIN",
  "userId": 123,
  "ip": "192.168.1.1",
  "details": { ... }
}
```

### Endpoints
```javascript
GET  /logs                    // כל הלוגים (עם pagination)
GET  /logs?level=error        // סינון לפי level
GET  /logs?date=2025-12-22    // לוגים מתאריך מסוים
POST /logs/clear              // ניקוי לוגים ישנים
GET  /logs/stats              // סטטיסטיקות לוגים
```

### דרישות
- ✅ שמירה בקובץ `logs.txt` (שורה לכל log)
- ✅ Rotation: כשהקובץ גדול מ-1MB, צור קובץ חדש
- ✅ שמור רק 5 קבצי לוג אחרונים
- ✅ Middleware שרושם כל בקשה HTTP

### בונוס
- קריאת לוגים בצורה יעילה (ללא טעינת הכל לזיכרון)
- חיפוש בלוגים
- Export logs ל-JSON

---

## תרגיל 4️⃣ - מערכת Backup אוטומטית

### משימה
צור מערכת שיוצרת backups אוטומטיים של הנתונים.

### דרישות
- ✅ יצירת backup כל דקה
- ✅ שמירת 10 backups אחרונים בלבד
- ✅ שם הקובץ: `users.backup.TIMESTAMP.json`
- ✅ מחיקה אוטומטית של backups ישנים

### Endpoints
```javascript
POST   /backup/create         // צור backup ידנית
GET    /backup/list           // רשימת כל הbackups
POST   /backup/restore/:timestamp  // שחזר מbackup
DELETE /backup/:timestamp     // מחק backup ספציפי
GET    /backup/stats          // סטטיסטיקות
```

### בונוס
- דחיסת backups (gzip)
- שחזור חכם (עם אישור מהמשתמש)
- Backup differential (רק השינויים)

---

## תרגיל 5️⃣ - מערכת העלאת קבצים

### משימה
צור API שמאפשר להעלות קבצים טקסט ולשמור אותם.

### Endpoints
```javascript
POST   /upload                // העלה קובץ
GET    /files                 // רשימת כל הקבצים
GET    /files/:filename       // הורד קובץ
DELETE /files/:filename       // מחק קובץ
GET    /files/:filename/info  // מידע על קובץ
```

### דרישות
- ✅ שמירה בתיקייה `uploads/`
- ✅ תמיכה רק בקבצי `.txt` ו-`.json`
- ✅ הגבלת גודל לכל קובץ (למשל 1MB)
- ✅ שינוי שם אוטומטי אם הקובץ כבר קיים

### מידע על קובץ
```json
{
  "filename": "document.txt",
  "size": 1024,
  "createdAt": "2025-12-22T10:00:00.000Z",
  "mimeType": "text/plain"
}
```

### בונוס
- חיפוש תוכן בקבצים
- סטטיסטיקות: כמה קבצים, גודל כולל
- העלאה מרובה (multiple files)

---

## תרגיל 6️⃣ - מערכת הזמנות למסעדה

### משימה
צור API לניהול הזמנות במסעדה.

### מבנה הזמנה
```json
{
  "id": 1,
  "customerName": "יוסי כהן",
  "items": [
    { "name": "פיצה", "quantity": 2, "price": 50 },
    { "name": "סלט", "quantity": 1, "price": 30 }
  ],
  "totalPrice": 130,
  "status": "pending",  // pending, preparing, ready, delivered
  "orderTime": "2025-12-22T12:00:00.000Z",
  "deliveryAddress": "רחוב הרצל 10"
}
```

### Endpoints
```javascript
GET    /orders                    // כל ההזמנות
GET    /orders/:id                // הזמנה ספציפית
POST   /orders                    // צור הזמנה
PUT    /orders/:id/status         // עדכן סטטוס
DELETE /orders/:id                // ביטול הזמנה
GET    /orders/stats/daily        // סטטיסטיקות יומיות
```

### דרישות
- ✅ שמירה בקובץ `orders.json`
- ✅ חישוב מחיר כולל אוטומטי
- ✅ סינון לפי סטטוס
- ✅ סינון לפי תאריך

### בונוס
- דוח הזמנות יומי ב-TXT
- סטטיסטיקות: מה המנה הפופולרית ביותר
- התראה להזמנות ישנות (מעל שעה)

---

## תרגיל 7️⃣ - מערכת ניהול מלאי

### משימה
צור API לניהול מלאי מוצרים.

### מבנה מוצר
```json
{
  "id": 1,
  "name": "Laptop",
  "sku": "LAP-001",
  "quantity": 10,
  "minQuantity": 5,  // כמות מינימלית לאזהרה
  "price": 3500,
  "category": "electronics",
  "supplier": "Tech Corp",
  "lastRestocked": "2025-12-01"
}
```

### Endpoints
```javascript
GET    /inventory                  // כל המלאי
GET    /inventory/:id              // מוצר ספציפי
POST   /inventory                  // הוסף מוצר
PUT    /inventory/:id              // עדכן מוצר
DELETE /inventory/:id              // מחק מוצר
POST   /inventory/:id/restock      // עדכן מלאי
GET    /inventory/alerts           // מוצרים שחסרים
GET    /inventory/stats            // סטטיסטיקות
```

### דרישות
- ✅ שמירה בקובץ `inventory.json`
- ✅ אזהרה כשמוצר מתחת ל-minQuantity
- ✅ מעקב אחרי תאריך עדכון אחרון
- ✅ חיפוש לפי SKU

### בונוס
- ייצוא דוח מלאי ל-CSV
- גרף מלאי לאורך זמן
- התראות אוטומטיות למוצרים חסרים

---

## תרגיל 8️⃣ - פרויקט משולב: מערכת CRM פשוטה

### משימה
צור מערכת CRM (Customer Relationship Management) מלאה.

### קבצי נתונים
- `customers.json` - לקוחות
- `interactions.json` - אינטראקציות עם לקוחות
- `tasks.json` - משימות
- `logs.txt` - לוגים

### מבנה לקוח
```json
{
  "id": 1,
  "name": "חברת ABC",
  "contactPerson": "יוסי כהן",
  "email": "yossi@abc.com",
  "phone": "050-1234567",
  "status": "active",  // active, inactive, lead
  "createdAt": "2025-12-01",
  "lastContact": "2025-12-20"
}
```

### מבנה אינטראקציה
```json
{
  "id": 1,
  "customerId": 1,
  "type": "call",  // call, email, meeting
  "notes": "שיחה לגבי פרויקט חדש",
  "date": "2025-12-22T10:00:00.000Z"
}
```

### Endpoints מינימליים
```javascript
// Customers
GET/POST/PUT/DELETE  /customers
GET                  /customers/:id/interactions

// Interactions
GET/POST             /interactions
POST                 /customers/:id/interactions

// Tasks
GET/POST/PUT/DELETE  /tasks

// Reports
GET                  /reports/customers
GET                  /reports/interactions
```

### דרישות
- ✅ כל הפעולות CRUD על כל הישויות
- ✅ קישורים בין לקוחות לאינטראקציות
- ✅ דוחות: לקוחות פעילים, אינטראקציות לחודש
- ✅ Backup אוטומטי כל 10 דקות
- ✅ Logging מלא

### בונוס
- Dashboard עם סטטיסטיקות
- ייצוא דוחות ל-CSV/PDF
- התראות למשימות דחופות
- חיפוש מתקדם

---

## 💡 טיפים להצלחה

1. **התחל קטן** - תרגיל 1 לפני תרגיל 8
2. **קוד נקי** - הפרד פונקציות לקבצים
3. **Error handling** - תמיד try/catch
4. **בדוק** - השתמש ב-Postman או Thunder Client
5. **תיעוד** - כתוב README לכל תרגיל

---

## ✅ רשימת בדיקה לכל תרגיל

- [ ] הקוד רץ בלי שגיאות
- [ ] יש try/catch בכל פונקציה אסינכרונית
- [ ] הקבצים נשמרים נכון (JSON מעוצב)
- [ ] יש Validation על קלט
- [ ] יש טיפול ב-404 (לא נמצא)
- [ ] יש טיפול ב-409 (כפילות)
- [ ] הקוד מסודר וקריא
- [ ] יש הערות (comments) במקומות חשובים

---

**בהצלחה! 💪🚀**

אחרי שתסיים את התרגילים, תהיה מומחה ב-File System Promises!
