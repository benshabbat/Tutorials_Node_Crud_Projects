# מערכת אימות עם Headers ו-Tokens - פתרון מודולרי

פתרון מלא ומודולרי למערכת אימות מתקדמת עם Bearer Tokens ב-Authorization Headers.

## מבנה הפרויקט

```
auth-headers-solution/
├── server.js              # נקודת הכניסה
├── package.json
├── data/                  # קבצי JSON
│   └── users.json
├── models/                # לוגיקת גישה לנתונים
│   └── userModel.js
├── controllers/           # לוגיקת עסקית
│   └── authController.js
├── services/              # שירותי עזר
│   └── authService.js
├── routes/                # הגדרת נתיבים
│   └── authRoutes.js
└── middleware/            # Middleware functions
    ├── authMiddleware.js
    └── errorHandler.js
```

## התקנה והרצה

```bash
npm install
npm run dev
```

## איך האימות עובד?

1. **Register/Login** - קבלת Token
2. **כל בקשה מוגנת** - שליחת Token ב-Authorization Header
3. **Format**: `Authorization: Bearer <your-token>`

## Endpoints

### Public Routes
- `POST /register` - הרשמה וקבלת token
- `POST /login` - התחברות וקבלת token חדש
- `GET /custom-headers` - בדיקת headers (ללמידה)

### Protected Routes (דורשים token)
- `GET /profile` - פרופיל משתמש
- `PUT /profile` - עדכון פרופיל
- `POST /logout` - התנתקות (ביטול token)
- `GET /users` - רשימת משתמשים
- `DELETE /account` - מחיקת חשבון

## דוגמאות שימוש

### הרשמה
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","email":"john@example.com","password":"password123"}'
```

**תגובה:**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
}
```

### התחברות
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"password123"}'
```

### קבלת פרופיל (עם token)
```bash
curl http://localhost:3000/profile \
  -H "Authorization: Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
```

### עדכון פרופיל
```bash
curl -X PUT http://localhost:3000/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" \
  -d '{"email":"newemail@example.com"}'
```

### התנתקות
```bash
curl -X POST http://localhost:3000/logout \
  -H "Authorization: Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
```

### בדיקת Headers (לתרגול)
```bash
curl http://localhost:3000/custom-headers \
  -H "X-Custom-1: value1" \
  -H "X-Custom-2: value2" \
  -H "User-Agent: MyApp/1.0"
```

## תכונות

- ✅ אימות מבוסס Tokens
- ✅ Header parsing מתקדם
- ✅ Middleware לאבטחת routes
- ✅ יצירת tokens אוטומטית
- ✅ ביטול tokens ב-logout
- ✅ הפרדה ברורה בין routes מוגנים לציבוריים

## ארכיטקטורה

המערכת בנויה בשכבות:

1. **Services** - פונקציות עזר (token generation, parsing)
2. **Models** - גישה לנתונים
3. **Middleware** - אימות ובדיקות
4. **Controllers** - לוגיקה עסקית
5. **Routes** - הגדרת endpoints

## בטיחות

- סיסמאות לא מוחזרות בתגובות
- Tokens מאוחסנים בצד השרת
- בדיקת תקינות Headers
- הודעות שגיאה ברורות

## הבדל ממערכות אחרות

| Feature | Simple Auth | Headers Auth |
|---------|-------------|--------------|
| Method | Username+Password בכל בקשה | Token ב-Header |
| Security | פחות | יותר |
| Convenience | פשוט | נוח יותר |
| Real-world | לא מומלץ | מומלץ |

## טיפים

1. **שמור את ה-Token** - אחרי login, שמור את ה-token בצד הלקוח
2. **Header Format** - חשוב: `Bearer <space> <token>`
3. **Logout** - מבטל את ה-token בצד השרת
4. **New Token** - כל login מייצר token חדש

זוהי גישה קרובה יותר למערכות אמיתיות!
