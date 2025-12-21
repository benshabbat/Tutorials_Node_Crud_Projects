# 💪 תרגילים - Node.js CRUD

## 📝 רמת קושי: מתחילים

### תרגיל 1: בדיקת נקודות קצה (Endpoints)
**מטרה:** הבנת פעולות CRUD בסיסיות

1. הרץ את השרת בפרויקט הראשי (`npm start`)
2. השתמש ב-cURL או Postman לביצוע הפעולות הבאות:
   - הוסף 3 משתמשים חדשים עם שמות ואימיילים שונים
   - קבל את רשימת כל המשתמשים
   - עדכן את השם של המשתמש עם ID=2
   - מחק את המשתמש עם ID=1
   - נסה לקבל את המשתמש שמחקת - מה התוצאה?

**שאלות להבנה:**
- מה ההבדל בין GET ל-POST?
- למה צריך לשלוח `Content-Type: application/json` בבקשות POST/PUT?
- מה קורה לנתונים כשעוצרים את השרת?

---

### תרגיל 2: הוספת שדות חדשים
**מטרה:** שינוי מודל נתונים והוספת validation

**משימה:**
1. פתח את `server.js`
2. הוסף שדה `phone` למשתמש (אופציונלי)
3. הוסף שדה `age` למשתמש (חובה, חייב להיות מספר)
4. הוסף בדיקה שהגיל נמצא בין 0 ל-120

**דוגמה:**
```javascript
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "050-1234567",  // חדש
  "age": 25                 // חדש
}
```

**בדיקה:**
- נסה ליצור משתמש ללא שדה age - האם אתה מקבל שגיאה?
- נסה ליצור משתמש עם age: 150 - האם אתה מקבל שגיאה?
- נסה ליצור משתמש עם age: "abc" - האם אתה מקבל שגיאה?

---

### תרגיל 3: שיפור הודעות שגיאה
**מטרה:** למידה על error handling

**משימה:**
הוסף הודעות שגיאה מפורטות יותר:
- כאשר משתמש לא קיים: "משתמש עם ID {id} לא נמצא"
- כאשר חסר שם: "שדה שם הוא חובה"
- כאשר חסר אימייל: "שדה אימייל הוא חובה"
- כאשר האימייל לא תקין: "פורמט האימייל לא תקין"

**רמז:** השתמש ב-regex לבדיקת פורמט אימייל:
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

---

## 📚 רמת קושי: בינוני

### תרגיל 4: יצירת API למוצרים
**מטרה:** יישום מערכת CRUD שלמה מאפס

**משימה:** צור API חדש למוצרים במבנה Modular

**מבנה התיקיות:**
```
products-api/
├── server.js
├── routes/
│   └── productRoutes.js
├── controllers/
│   └── productController.js
└── models/
    └── productModel.js
```

**מודל המוצר:**
```javascript
{
  id: 1,
  name: "מחשב נייד",
  price: 3500,
  category: "אלקטרוניקה",
  stock: 15,
  description: "מחשב נייד מתקדם"
}
```

**נקודות קצה נדרשות:**
- `GET /products` - קבלת כל המוצרים
- `GET /products/:id` - קבלת מוצר ספציפי
- `POST /products` - יצירת מוצר חדש
- `PUT /products/:id` - עדכון מוצר
- `DELETE /products/:id` - מחיקת מוצר

**בדיקות validation:**
- שם חייב להיות לפחות 2 תווים
- מחיר חייב להיות חיובי
- מלאי לא יכול להיות שלילי

---

### תרגיל 5: הוספת פילטרים וחיפוש
**מטרה:** למידת Query Parameters

**משימה:**
הוסף אפשרויות סינון לנקודת הקצה `GET /products`:

**דוגמאות שימוש:**
```
GET /products?category=אלקטרוניקה
GET /products?minPrice=1000&maxPrice=5000
GET /products?search=מחשב
GET /products?inStock=true
GET /products?sortBy=price&order=asc
```

**רמז:** השתמש ב-`req.query` כדי לקבל את הפרמטרים
```javascript
const { category, minPrice, maxPrice, search } = req.query;
```

---

### תרגיל 6: Middleware לוגינג
**מטרה:** הבנת Middleware

**משימה:**
צור middleware שרושם כל בקשה לשרת:

**דוגמה לפלט:**
```
[2024-12-21 14:30:45] GET /products - 200 OK
[2024-12-21 14:31:12] POST /products - 201 Created
[2024-12-21 14:32:05] DELETE /products/5 - 404 Not Found
```

**דרישות:**
- תאריך ושעה
- שיטת HTTP (GET/POST וכו')
- נתיב (path)
- קוד סטטוס

**רמז:** השתמש ב-`Date()` ו-`res.on('finish')`

---

## 🚀 רמת קושי: מתקדמים

### תרגיל 7: מערכת הזמנות מלאה
**מטרה:** שילוב מספר ישויות (entities)

**משימה:**
צור מערכת הזמנות הכוללת:
- **משתמשים** (Users)
- **מוצרים** (Products)
- **הזמנות** (Orders)

**מבנה הזמנה:**
```javascript
{
  id: 1,
  userId: 2,
  items: [
    { productId: 1, quantity: 2 },
    { productId: 3, quantity: 1 }
  ],
  totalPrice: 7500,
  status: "pending", // pending, confirmed, shipped, delivered
  createdAt: "2024-12-21T14:30:00Z"
}
```

**נקודות קצה נדרשות:**
- `POST /orders` - יצירת הזמנה חדשה
- `GET /orders/:id` - קבלת הזמנה
- `GET /users/:userId/orders` - כל ההזמנות של משתמש
- `PATCH /orders/:id/status` - עדכון סטטוס הזמנה

**לוגיקה עסקית:**
- בדיקה שהמשתמש קיים
- בדיקה שכל המוצרים קיימים
- בדיקה שיש מספיק מלאי
- חישוב אוטומטי של המחיר הכולל
- הפחתת מלאי אוטומטית

---

### תרגיל 8: Authentication בסיסי
**מטרה:** הבנת authentication

**משימה:**
הוסף מערכת התחברות פשוטה:

**נקודות קצה:**
```javascript
POST /auth/register - הרשמה
POST /auth/login - התחברות
```

**דרישות:**
1. שמור סיסמאות בצורה מוצפנת (השתמש ב-bcrypt)
2. צור token פשוט (מחרוזת אקראית)
3. שמור tokens ב-memory
4. הוסף middleware לבדיקת authentication

**התקנה:**
```bash
npm install bcrypt
```

**דוגמה לשימוש:**
```javascript
import bcrypt from 'bcrypt';

// Hash password
const hashedPassword = await bcrypt.hash(password, 10);

// Compare password
const isValid = await bcrypt.compare(password, hashedPassword);
```

**Middleware לבדיקה:**
```javascript
export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  // בדיקת token...
  next();
};
```

---

### תרגיל 9: Pagination
**מטרה:** למידת pagination לקבוצות נתונים גדולות

**משימה:**
הוסף pagination לנקודת הקצה של products:

**דוגמאות שימוש:**
```
GET /products?page=1&limit=10
GET /products?page=2&limit=5
```

**תגובה מצופה:**
```javascript
{
  success: true,
  data: [...], // 10 מוצרים
  pagination: {
    currentPage: 1,
    totalPages: 5,
    totalItems: 50,
    itemsPerPage: 10,
    hasNextPage: true,
    hasPrevPage: false
  }
}
```

**רמז:** חישוב pagination
```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const startIndex = (page - 1) * limit;
const endIndex = startIndex + limit;

const results = allProducts.slice(startIndex, endIndex);
```

---

### תרגיל 10: ייצוא לקובץ
**מטרה:** עבודה עם File System

**משימה:**
הוסף endpoint שמייצא את כל הנתונים לקובץ JSON:

**נקודת קצה:**
```
GET /export/users
GET /export/products
GET /export/all
```

**השתמש ב-fs module:**
```javascript
import fs from 'fs/promises';

await fs.writeFile('users.json', JSON.stringify(users, null, 2));
```

**בונוס:**
- הוסף תאריך לשם הקובץ: `users-2024-12-21.json`
- אפשר גם ייצוא בפורמט CSV

---

## 🎯 פרויקט מסכם

### תרגיל 11: Blog API מלא
**מטרה:** שילוב כל מה שלמדת

**מערכת הכוללת:**

**1. משתמשים:**
- הרשמה והתחברות
- פרופיל משתמש
- עדכון פרטים

**2. פוסטים (Posts):**
```javascript
{
  id: 1,
  title: "כותרת",
  content: "תוכן...",
  authorId: 2,
  tags: ["nodejs", "tutorial"],
  published: true,
  createdAt: "...",
  updatedAt: "..."
}
```

**3. תגובות (Comments):**
```javascript
{
  id: 1,
  postId: 5,
  userId: 3,
  content: "תגובה מעולה!",
  createdAt: "..."
}
```

**דרישות:**
- ✅ מבנה modular מלא (routes, controllers, services, models)
- ✅ Validation מקיף
- ✅ Error handling מתקדם
- ✅ Authentication
- ✅ Authorization (רק המחבר יכול למחוק/לערוך)
- ✅ חיפוש וסינונים
- ✅ Pagination
- ✅ Middleware logging
- ✅ תיעוד API (README)

**נקודות קצה מלאות:**

**Auth:**
- POST /auth/register
- POST /auth/login
- GET /auth/profile
- PUT /auth/profile

**Posts:**
- GET /posts (עם פילטרים)
- GET /posts/:id
- POST /posts (דורש התחברות)
- PUT /posts/:id (רק המחבר)
- DELETE /posts/:id (רק המחבר)
- GET /posts/user/:userId (כל הפוסטים של משתמש)

**Comments:**
- GET /posts/:postId/comments
- POST /posts/:postId/comments (דורש התחברות)
- DELETE /comments/:id (רק המגיב)

**חיפוש:**
- GET /search?q=nodejs
- GET /posts?tag=tutorial
- GET /posts?author=username

---

## 📖 משאבים נוספים

### כלים מומלצים:
- **Postman** - לבדיקת API
- **Thunder Client** - תוסף ל-VS Code
- **Nodemon** - auto-reload בזמן פיתוח

### ספריות שימושיות:
```bash
npm install express      # שרת
npm install bcrypt       # הצפנת סיסמאות
npm install joi          # validation מתקדם
npm install dotenv       # ניהול משתני סביבה
```

### טיפים:
1. 🔍 תמיד בדוק עם `console.log()` מה קורה
2. 📝 כתוב תיעוד לכל endpoint
3. ✅ בדוק את כל המקרים (success, error, edge cases)
4. 🎨 השתמש בכלים כמו Postman
5. 🔄 נסה לשבור את הקוד שלך - זה הדרך הטובה ביותר ללמוד!

---

## 🏆 אתגרים נוספים

רוצה עוד? נסה את זה:
- הוסף Rate Limiting (הגבלת בקשות)
- הוסף CORS
- הוסף Swagger לתיעוד אוטומטי
- חבר את הפרויקט למסד נתונים אמיתי (MongoDB/PostgreSQL)
- הוסף File Upload לתמונות
- בנה Frontend פשוט שמתחבר ל-API

---

**בהצלחה! 💪🚀**

אם אתה נתקע, חזור למדריכים או נסה לחפש בגוגל - זה חלק מהלמידה!
