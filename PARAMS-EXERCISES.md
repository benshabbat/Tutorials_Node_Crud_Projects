# 🎯 תרגילים מעשיים - Parameters

## 📋 הוראות

1. צור תיקייה חדשה לתרגילים
2. העתק את הקובץ `params-exercises-template.js` לתיקייה
3. השלם את התרגילים אחד אחד
4. הרץ את השרת ובדוק עם דפדפן/Postman

---

## תרגיל 1️⃣ - Route Parameters בסיסי

**משימה:** צור endpoint שמקבל שם משתמש ומחזיר את הפרופיל שלו.

```javascript
// Route:
GET /profile/:username

// דוגמה:
GET /profile/yossi123

// תשובה צפויה:
{
  "username": "yossi123",
  "profileUrl": "http://localhost:3000/profile/yossi123",
  "message": "ברוך הבא, yossi123!"
}
```

**רמז:** השתמש ב-`req.params.username`

---

## תרגיל 2️⃣ - Route Parameters מתקדם

**משימה:** צור endpoint שמחזיר מידע על ספר לפי ISBN ושנה.

```javascript
// Route:
GET /books/:isbn/year/:year

// דוגמה:
GET /books/978-3-16-148410-0/year/2020

// תשובה צפויה:
{
  "isbn": "978-3-16-148410-0",
  "year": "2020",
  "message": "מחפש ספר עם ISBN 978-3-16-148410-0 שיצא ב-2020"
}
```

**רמז:** השתמש ב-destructuring: `const { isbn, year } = req.params`

---

## תרגיל 3️⃣ - Query Parameters - סינון

**משימה:** צור endpoint לחיפוש מכוניות עם סינונים.

```javascript
// Route:
GET /cars

// דוגמאות:
GET /cars?color=red
GET /cars?brand=toyota&year=2020
GET /cars?minPrice=50000&maxPrice=100000

// תשובה צפויה:
{
  "filters": {
    "color": "red",
    "brand": null,
    "year": null,
    "minPrice": null,
    "maxPrice": null
  },
  "message": "מחפש מכוניות לפי הסינונים"
}
```

**רמז:** השתמש ב-`req.query` וערכי default

---

## תרגיל 4️⃣ - Query Parameters - מיון ודפדוף

**משימה:** צור endpoint לרשימת סרטים עם מיון ו-pagination.

```javascript
// Route:
GET /movies

// דוגמאות:
GET /movies?sortBy=rating&order=desc
GET /movies?page=2&limit=10
GET /movies?genre=action&sortBy=year&order=asc&page=1&limit=5

// תשובה צפויה:
{
  "filters": {
    "genre": "action"
  },
  "sorting": {
    "sortBy": "year",
    "order": "asc"
  },
  "pagination": {
    "page": 1,
    "limit": 5,
    "totalPages": 10,
    "totalItems": 50
  },
  "movies": []
}
```

**רמז:** השתמש בערכי default: `const { page = 1, limit = 10 } = req.query`

---

## תרגיל 5️⃣ - Body Parameters - יצירה

**משימה:** צור endpoint ליצירת פוסט חדש בבלוג.

```javascript
// Route:
POST /posts

// Body:
{
  "title": "הפוסט הראשון שלי",
  "content": "זה התוכן של הפוסט",
  "author": "יוסי",
  "tags": ["nodejs", "tutorial"]
}

// תשובה צפויה:
{
  "success": true,
  "message": "פוסט נוצר בהצלחה",
  "post": {
    "id": 1,
    "title": "הפוסט הראשון שלי",
    "content": "זה התוכן של הפוסט",
    "author": "יוסי",
    "tags": ["nodejs", "tutorial"],
    "createdAt": "2025-12-22T10:30:00.000Z"
  }
}
```

**רמזים:**
- אל תשכח `app.use(express.json())`
- בדוק שהשדות החובה קיימים
- השתמש ב-`Date.now()` או `new Date()` ל-ID ותאריך

---

## תרגיל 6️⃣ - Body + Params - עדכון

**משימה:** צור endpoint לעדכון מוצר קיים.

```javascript
// Route:
PUT /products/:id

// דוגמה:
PUT /products/123

// Body:
{
  "price": 299.99,
  "stock": 50
}

// תשובה צפויה:
{
  "success": true,
  "message": "מוצר 123 עודכן בהצלחה",
  "updates": {
    "price": 299.99,
    "stock": 50
  }
}
```

**רמז:** קבל את ה-ID מ-`req.params.id` והשינויים מ-`req.body`

---

## תרגיל 7️⃣ - Headers - אימות

**משימה:** צור endpoint מוגן שדורש API Key ב-header.

```javascript
// Route:
GET /admin/dashboard

// Headers:
X-API-KEY: my-secret-key-12345

// תשובה כשיש key:
{
  "success": true,
  "message": "ברוך הבא לדשבורד",
  "data": { "users": 100, "orders": 500 }
}

// תשובה בלי key:
{
  "error": "נדרש API Key",
  "hint": "הוסף header: X-API-KEY"
}
```

**רמזים:**
- השתמש ב-`req.headers['x-api-key']` (headers הם lowercase!)
- החזר status 401 אם אין key
- החזר status 403 אם ה-key לא נכון

---

## תרגיל 8️⃣ - שילוב הכל

**משימה:** צור endpoint מורכב שמשלב params, query, body ו-headers.

```javascript
// Route:
POST /api/v1/users/:userId/orders

// Params: userId
// Query: type (delivery/pickup), notify (true/false)
// Body: { items: [], address: "" }
// Headers: Authorization

// דוגמה:
POST /api/v1/users/123/orders?type=delivery&notify=true
Authorization: Bearer token123

{
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 5, "quantity": 1 }
  ],
  "address": "רחוב הרצל 10, תל אביב"
}

// תשובה צפויה:
{
  "success": true,
  "message": "הזמנה נוצרה בהצלחה",
  "order": {
    "id": 5001,
    "userId": 123,
    "type": "delivery",
    "items": [...],
    "address": "רחוב הרצל 10, תל אביב",
    "willNotify": true,
    "createdAt": "..."
  }
}
```

**רמזים:**
- בדוק authorization ראשון
- ודא שכל הפרמטרים הכרחיים קיימים
- `notify` הוא string 'true' או 'false', המר ל-boolean

---

## תרגיל 9️⃣ - Validation מלא

**משימה:** צור endpoint עם בדיקות קלט מלאות.

```javascript
// Route:
POST /register

// Body:
{
  "username": "yossi123",
  "email": "yossi@example.com",
  "password": "pass123",
  "age": 25
}

// כללי Validation:
// - username: 3-20 תווים, רק אותיות ומספרים
// - email: חייב להכיל @ ו-.
// - password: מינימום 6 תווים
// - age: מעל 18

// תשובה עם שגיאות:
{
  "success": false,
  "errors": [
    "הסיסמה חייבת להכיל לפחות 6 תווים",
    "גיל מינימלי הוא 18"
  ]
}

// תשובה מוצלחת:
{
  "success": true,
  "message": "נרשמת בהצלחה!",
  "user": { ... }
}
```

**רמזים:**
- צור מערך errors ריק
- בדוק כל תנאי והוסף שגיאות למערך
- אם יש שגיאות, החזר 400 + רשימת השגיאות
- אם הכל תקין, צור את המשתמש

---

## תרגיל 🔟 - פרויקט מיני: To-Do List API

**משימה:** צור API מלא לניהול משימות.

### Endpoints נדרשים:

```javascript
// 1. קבל את כל המשימות (עם סינונים)
GET /todos?status=pending&sortBy=createdAt&order=desc

// 2. קבל משימה ספציפית
GET /todos/:id

// 3. צור משימה חדשה
POST /todos
Body: { title, description, priority, dueDate }

// 4. עדכן משימה
PUT /todos/:id
Body: { title?, description?, status?, priority? }

// 5. מחק משימה
DELETE /todos/:id?reason=completed

// 6. סמן משימה כהושלמה
PATCH /todos/:id/complete

// 7. חיפוש משימות
GET /search?q=shopping&fields=title,description
```

### דרישות:
- ✅ Validation מלא על כל endpoint
- ✅ הודעות שגיאה ברורות בעברית
- ✅ Status codes נכונים (200, 201, 400, 404)
- ✅ מאגר נתונים (מערך)
- ✅ IDs אוטומטיים
- ✅ תאריכים (createdAt, updatedAt)

---

## 🎓 בונוס - אתגרים נוספים

### אתגר 1: Rate Limiting
צור middleware שבודק כמה פעמים משתמש קרא ל-API ומגביל אותו.

### אתגר 2: Pagination מתקדם
צור מערכת pagination עם links (next, previous, first, last).

### אתגר 3: API Documentation
צור endpoint שמחזיר תיעוד אוטומטי של כל ה-endpoints.

### אתגר 4: Request Logger
צור middleware שרושם כל בקשה (method, path, params, query, body).

---

## ✅ פתרונות

הפתרונות לכל התרגילים נמצאים בקובץ:
`params-exercises-solutions.js`

אל תציץ לפני שניסית! 😊

---

## 💡 טיפים להצלחה

1. **התחל קטן** - תרגיל אחד בכל פעם
2. **בדוק בדפדפן** - עבור GET requests
3. **השתמש ב-Postman** - עבור POST/PUT/DELETE
4. **הדפס ל-console** - `console.log(req.params, req.query, req.body)`
5. **קרא שגיאות** - הן מגיד לך מה לא בסדר!
6. **התנסה** - נסה ערכים שונים ותראה מה קורה

---

## 🚀 כשתסיים את כל התרגילים

אתה תדע:
- ✅ להשתמש ב-Route Params למזהים
- ✅ להשתמש ב-Query לסינונים ומיון
- ✅ להשתמש ב-Body ליצירה ועדכון
- ✅ לבדוק Headers לאימות
- ✅ לשלב הכל ביחד ל-API מורכב
- ✅ לעשות Validation מלא
- ✅ לכתוב קוד נקי ומסודר

**בהצלחה! 💪🎉**
