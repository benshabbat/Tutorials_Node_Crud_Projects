# פתרון מודולרי - CRUD עם קבצי JSON

פתרון מלא ומודולרי לתרגילי CRUD בסיסיים עם קבצי JSON.

## מבנה הפרויקט

```
crud-json-solution/
├── server.js              # נקודת הכניסה - הגדרת Express והפעלת השרת
├── package.json
├── data/                  # קבצי JSON לאחסון נתונים
│   ├── users.json
│   └── tasks.json
├── models/                # לוגיקת גישה לנתונים
│   ├── userModel.js
│   └── taskModel.js
├── controllers/           # לוגיקת עסקית
│   ├── userController.js
│   └── taskController.js
├── routes/                # הגדרת נתיבים
│   ├── userRoutes.js
│   └── taskRoutes.js
└── middleware/            # Middleware functions
    └── errorHandler.js
```

## התקנה והרצה

```bash
npm install
npm run dev
```

## Endpoints

### Users API

- `GET /users` - קבלת כל המשתמשים
- `GET /users/:id` - קבלת משתמש לפי ID
- `GET /users/search?city=TelAviv` - חיפוש משתמשים לפי עיר
- `POST /users` - יצירת משתמש חדש
- `PUT /users/:id` - עדכון משתמש
- `DELETE /users/:id` - מחיקת משתמש

### Tasks API

- `GET /tasks` - קבלת כל המשימות
- `GET /tasks/:id` - קבלת משימה לפי ID
- `GET /tasks/filter?completed=true` - סינון לפי סטטוס
- `GET /tasks/filter?priority=high` - סינון לפי עדיפות
- `POST /tasks` - יצירת משימה חדשה
- `PUT /tasks/:id` - עדכון משימה
- `PATCH /tasks/:id/toggle` - שינוי סטטוס completed
- `DELETE /tasks/:id` - מחיקת משימה

## דוגמאות שימוש

### יצירת משתמש חדש
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Yael","age":27,"city":"Netanya"}'
```

### יצירת משימה חדשה
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"לקרוא ספר","priority":"low"}'
```

## ארכיטקטורה

הפרויקט מחולק לשכבות:

1. **Models** - גישה ישירה לקבצי JSON, קריאה וכתיבה
2. **Controllers** - לוגיקה עסקית וטיפול בבקשות
3. **Routes** - הגדרת endpoints וחיבור ל-controllers
4. **Middleware** - טיפול בשגיאות ו-404

כל שכבה אחראית על תפקיד ספציפי, מה שמקל על תחזוקה והרחבה.
