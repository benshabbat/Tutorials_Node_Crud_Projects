# מערכת אימות פשוטה - פתרון מודולרי

פתרון מלא ומודולרי למערכת אימות פשוטה עם username + password בכל בקשה.

## מבנה הפרויקט

```
simple-auth-solution/
├── server.js              # נקודת הכניסה
├── package.json
├── data/                  # קבצי JSON - מתחילים ריקים
│   ├── users.json
│   └── posts.json
├── models/                # לוגיקת גישה לנתונים
│   ├── userModel.js
│   └── postModel.js
├── controllers/           # לוגיקת עסקית
│   ├── authController.js
│   └── postController.js
├── routes/                # הגדרת נתיבים
│   ├── authRoutes.js
│   └── postRoutes.js
└── middleware/            # Middleware functions
    └── errorHandler.js
```

## התקנה והרצה

```bash
npm install
npm run dev
```

## איך האימות עובד?

בניגוד למערכות עם Tokens, כאן משתמשים שולחים את ה-username וה-password **בכל בקשה** שדורשת אימות.

## Endpoints

### Auth Routes (Public)
- `POST /register` - הרשמת משתמש חדש
- `POST /login` - בדיקת התחברות (אימות נתונים)
- `GET /users` - רשימת כל המשתמשים (ללא סיסמאות)

### Auth Routes (Protected)
- `PUT /profile` - עדכון פרופיל
- `DELETE /account` - מחיקת חשבון

### Posts Routes
- `GET /posts` - כל הפוסטים (Public)
- `GET /posts/my` - הפוסטים שלי (Protected)
- `POST /posts` - יצירת פוסט (Protected)
- `PUT /posts/:id` - עדכון פוסט (Protected, owner only)
- `DELETE /posts/:id` - מחיקת פוסט (Protected, owner only)

## דוגמאות שימוש

### הרשמה
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","email":"john@example.com","password":"password123"}'
```

### התחברות (בדיקת נתונים)
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"password123"}'
```

### יצירת פוסט (עם אימות)
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123",
    "title": "My First Post",
    "content": "This is my first post content"
  }'
```

### עדכון פוסט (רק הבעלים)
```bash
curl -X PUT http://localhost:3000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123",
    "title": "Updated Title",
    "content": "Updated content"
  }'
```

### מחיקת חשבון
```bash
curl -X DELETE http://localhost:3000/account \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"password123"}'
```

## תכונות

- ✅ אימות פשוט עם username + password
- ✅ בדיקת ownership לפוסטים
- ✅ מחיקה קסקדית (מחיקת חשבון מוחקת גם את הפוסטים)
- ✅ הסרת סיסמאות מתגובות API
- ✅ הפרדה ברורה בין routes מוגנים לציבוריים

## ארכיטקטורה

המערכת בנויה בארכיטקטורה מודולרית:
- **Models** - אחראים על גישה ושמירת נתונים
- **Controllers** - מכילים את הלוגיקה העסקית והאימות
- **Routes** - מגדירים את ה-endpoints
- **Middleware** - טיפול בשגיאות

## הבדל מ-Token Based Auth

במערכת זו:
- אין tokens
- ה-username וה-password נשלחים בכל בקשה
- פשוט יותר לבדיקות ותרגול
- פחות מאובטח בפרודקשיין (אבל טוב ללמידה!)

**הערה:** בפרודקשיין אמיתי, משתמשים ב-Tokens (JWT) ולא שולחים סיסמה בכל בקשה.
