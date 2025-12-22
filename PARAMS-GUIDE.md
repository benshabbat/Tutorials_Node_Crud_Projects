# 📘 מדריך Parameters ב-Node.js + Express

## 🎯 מה נלמד?

1. **Route Parameters (params)** - פרמטרים בנתיב ה-URL
2. **Query Parameters (query)** - פרמטרים אחרי סימן השאלה
3. **Body Parameters** - נתונים בגוף הבקשה
4. **Headers** - מידע נוסף בכותרות הבקשה

---

## 1️⃣ Route Parameters (req.params)

### 🤔 מה זה?

פרמטרים שנמצאים **בתוך** נתיב ה-URL. הם חלק מהכתובת עצמה.

### דוגמה בסיסית:

```javascript
import express from 'express';
const app = express();

// פרמטר אחד - id של משתמש
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ message: `אתה מחפש את משתמש מספר ${userId}` });
});

app.listen(3000);
```

**קריאה לכתובת:**
```
GET http://localhost:3000/users/123
```

**תשובה:**
```json
{
  "message": "אתה מחפש את משתמש מספר 123"
}
```

---

### 🎨 דוגמה עם כמה פרמטרים:

```javascript
// מספר פרמטרים - קטגוריה ומזהה מוצר
app.get('/categories/:category/products/:productId', (req, res) => {
  const { category, productId } = req.params;
  
  res.json({
    message: `מחפש מוצר ${productId} בקטגוריה ${category}`,
    category: category,
    productId: productId
  });
});
```

**קריאה לכתובת:**
```
GET http://localhost:3000/categories/electronics/products/456
```

**תשובה:**
```json
{
  "message": "מחפש מוצר 456 בקטגוריה electronics",
  "category": "electronics",
  "productId": "456"
}
```

---

### ✅ מתי להשתמש ב-Route Parameters?

- **מזהים** - `/users/123`, `/products/456`
- **שמות משאבים** - `/categories/electronics`, `/tags/nodejs`
- **מידע חיוני לנתיב** - חלק מההיררכיה של המשאב

---

## 2️⃣ Query Parameters (req.query)

### 🤔 מה זה?

פרמטרים שמופיעים **אחרי סימן השאלה** ב-URL. משמשים לסינון, מיון וחיפוש.

### דוגמה בסיסית:

```javascript
// חיפוש משתמשים עם סינונים
app.get('/users', (req, res) => {
  const { age, city, name } = req.query;
  
  res.json({
    message: 'חיפוש משתמשים',
    filters: {
      age: age || 'לא צוין',
      city: city || 'לא צוין',
      name: name || 'לא צוין'
    }
  });
});
```

**קריאה לכתובת:**
```
GET http://localhost:3000/users?age=25&city=TelAviv&name=Yossi
```

**תשובה:**
```json
{
  "message": "חיפוש משתמשים",
  "filters": {
    "age": "25",
    "city": "TelAviv",
    "name": "Yossi"
  }
}
```

---

### 🎨 דוגמה מתקדמת - סינון ומיון:

```javascript
app.get('/products', (req, res) => {
  // פרמטרי סינון ומיון
  const { 
    category,      // קטגוריה
    minPrice,      // מחיר מינימלי
    maxPrice,      // מחיר מקסימלי
    sortBy,        // מיון לפי
    order,         // סדר - asc/desc
    page,          // עמוד
    limit          // כמות תוצאות בעמוד
  } = req.query;

  // ערכי ברירת מחדל
  const currentPage = parseInt(page) || 1;
  const resultsPerPage = parseInt(limit) || 10;
  const sortField = sortBy || 'name';
  const sortOrder = order || 'asc';

  res.json({
    message: 'רשימת מוצרים',
    filters: {
      category: category || 'הכל',
      priceRange: {
        min: minPrice || 0,
        max: maxPrice || 'ללא הגבלה'
      }
    },
    sorting: {
      field: sortField,
      order: sortOrder
    },
    pagination: {
      page: currentPage,
      limit: resultsPerPage
    }
  });
});
```

**קריאה לכתובת:**
```
GET http://localhost:3000/products?category=electronics&minPrice=100&maxPrice=500&sortBy=price&order=desc&page=2&limit=20
```

**תשובה:**
```json
{
  "message": "רשימת מוצרים",
  "filters": {
    "category": "electronics",
    "priceRange": {
      "min": "100",
      "max": "500"
    }
  },
  "sorting": {
    "field": "price",
    "order": "desc"
  },
  "pagination": {
    "page": 2,
    "limit": 20
  }
}
```

---

### ✅ מתי להשתמש ב-Query Parameters?

- **סינון** - `?category=books&author=rowling`
- **מיון** - `?sortBy=price&order=desc`
- **חיפוש** - `?search=laptop&brand=dell`
- **דפדוף (Pagination)** - `?page=2&limit=10`
- **אופציות אופציונליות** - לא חובה לשלוח אותם

---

## 3️⃣ Body Parameters (req.body)

### 🤔 מה זה?

נתונים שנשלחים **בגוף הבקשה** (לא ב-URL). משמש ליצירה ועדכון של משאבים.

### הגדרת Middleware:

```javascript
import express from 'express';
const app = express();

// ⚠️ חובה להוסיף את זה כדי לקרוא JSON בגוף הבקשה!
app.use(express.json());
```

---

### דוגמה - יצירת משתמש:

```javascript
// יצירת משתמש חדש
app.post('/users', (req, res) => {
  const { name, email, age, city } = req.body;
  
  // בדיקת קלט
  if (!name || !email) {
    return res.status(400).json({
      error: 'שם ואימייל הם שדות חובה'
    });
  }

  // כאן היית שומר במסד נתונים...
  const newUser = {
    id: Date.now(),
    name,
    email,
    age: age || null,
    city: city || null,
    createdAt: new Date()
  };

  res.status(201).json({
    message: 'משתמש נוצר בהצלחה',
    user: newUser
  });
});
```

**קריאה עם Body:**
```
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "יוסי כהן",
  "email": "yossi@example.com",
  "age": 28,
  "city": "תל אביב"
}
```

**תשובה:**
```json
{
  "message": "משתמש נוצר בהצלחה",
  "user": {
    "id": 1703245692834,
    "name": "יוסsi כהן",
    "email": "yossi@example.com",
    "age": 28,
    "city": "תל אביב",
    "createdAt": "2025-12-22T10:34:52.834Z"
  }
}
```

---

### דוגמה - עדכון משתמש:

```javascript
// עדכון משתמש - שילוב של params ו-body
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;  // מזהה מה-URL
  const updates = req.body;       // שינויים מה-body

  res.json({
    message: `עדכון משתמש ${userId}`,
    userId: userId,
    updates: updates
  });
});
```

**קריאה:**
```
PUT http://localhost:3000/users/123
Content-Type: application/json

{
  "email": "new.email@example.com",
  "city": "ירושלים"
}
```

---

### ✅ מתי להשתמש ב-Body Parameters?

- **יצירה (POST)** - יצירת משתמש, מוצר, פוסט
- **עדכון (PUT/PATCH)** - עדכון מידע קיים
- **נתונים רגישים** - סיסמאות, מידע אישי (לא נראה ב-URL)
- **נתונים מורכבים** - JSON עם מבנה עמוק

---

## 4️⃣ Headers (req.headers)

### 🤔 מה זה?

מידע נוסף על הבקשה - סוג תוכן, הרשאות, שפה וכו'.

### דוגמה:

```javascript
app.get('/info', (req, res) => {
  const contentType = req.headers['content-type'];
  const authorization = req.headers['authorization'];
  const userAgent = req.headers['user-agent'];

  res.json({
    headers: {
      contentType: contentType || 'לא צוין',
      authorization: authorization || 'לא צוין',
      userAgent: userAgent || 'לא ידוע'
    }
  });
});
```

---

## 🎯 סיכום - מתי להשתמש במה?

| סוג | דוגמה | מתי להשתמש? |
|-----|-------|-------------|
| **Route Params** | `/users/:id` | מזהים ומשאבים ספציפיים |
| **Query Params** | `/users?age=25&city=TelAviv` | סינון, חיפוש, מיון, דפדוף |
| **Body** | `{ "name": "Yossi" }` | יצירה ועדכון של נתונים |
| **Headers** | `Authorization: Bearer token` | מידע טכני (הרשאות, סוג תוכן) |

---

## 💡 דוגמה משולבת - כל הסוגים ביחד!

```javascript
import express from 'express';
const app = express();

app.use(express.json());

// Route: מחיקת הזמנה ספציפית
// Params: orderId
// Query: reason, notify
// Body: feedback
// Headers: authorization
app.delete('/users/:userId/orders/:orderId', (req, res) => {
  // 1. Route Parameters
  const { userId, orderId } = req.params;
  
  // 2. Query Parameters
  const { reason, notify } = req.query;
  
  // 3. Body
  const { feedback } = req.body;
  
  // 4. Headers
  const token = req.headers['authorization'];

  // בדיקת הרשאה
  if (!token) {
    return res.status(401).json({ error: 'נדרש אימות' });
  }

  // תשובה
  res.json({
    message: 'הזמנה נמחקה בהצלחה',
    details: {
      userId: userId,
      orderId: orderId,
      reason: reason || 'לא צוין',
      willNotifyUser: notify === 'true',
      feedback: feedback || 'אין משוב',
      authenticated: !!token
    }
  });
});

app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
```

**קריאה מלאה:**
```
DELETE http://localhost:3000/users/123/orders/456?reason=outofstock&notify=true
Authorization: Bearer my-secret-token
Content-Type: application/json

{
  "feedback": "המוצר אזל מהמלאי"
}
```

**תשובה:**
```json
{
  "message": "הזמנה נמחקה בהצלחה",
  "details": {
    "userId": "123",
    "orderId": "456",
    "reason": "outofstock",
    "willNotifyUser": true,
    "feedback": "המוצר אזל מהמלאי",
    "authenticated": true
  }
}
```

---

## 🛠️ תרגילים למתרגלים

### תרגיל 1 - Route Parameters
צור endpoint שמקבל שם משתמש ושנה:
```
GET /profile/:username/year/:year
```

### תרגיל 2 - Query Parameters
צור endpoint לחיפוש ספרים:
```
GET /books?author=tolkien&minPages=300&genre=fantasy
```

### תרגיל 3 - Body + Params
צור endpoint לעדכון פוסט:
```
PUT /posts/:postId
Body: { title, content, tags }
```

### תרגיל 4 - שילוב הכל
צור endpoint שמשלב params, query, body ו-headers:
```
POST /api/users/:userId/comments?type=public&notify=true
Headers: Authorization, Content-Type
Body: { text, rating }
```

---

## 📚 טיפים חשובים

### ✅ עשה:
- השתמש ב-Route Params למזהים (`/users/123`)
- השתמש ב-Query למסננים (`?age=25&city=TelAviv`)
- השתמש ב-Body לנתונים מורכבים או רגישים
- בדוק תמיד אם הפרמטרים קיימים לפני השימוש

### ❌ אל תעשה:
- אל תשלח סיסמאות ב-Query Parameters (נראות ב-URL!)
- אל תשלח JSON מורכב ב-Query (השתמש ב-Body)
- אל תשתמש ב-GET עם Body (לא תקני)
- אל תשכח את `app.use(express.json())` כש��שתמש ב-Body

---

## 🎓 סיכום

1. **Params** → מזהים בנתיב: `/users/:id`
2. **Query** → סינונים ואופציות: `?age=25&city=TelAviv`
3. **Body** → נתונים מורכבים: `{ "name": "Yossi" }`
4. **Headers** → מטא-דטה: `Authorization: Bearer token`

**זכור:** כל אחד משמש למטרה אחרת. השתמש בכלי הנכון לצורך הנכון! 💪

---

## 🚀 צעד הבא

עכשיו שאתה מבין Parameters, אתה יכול:
- לבנות API מתקדם יותר
- להוסיף Validation (בדיקת קלט)
- ללמוד על Middleware
- להתחבר למסד נתונים

**בהצלחה! 🎉**
