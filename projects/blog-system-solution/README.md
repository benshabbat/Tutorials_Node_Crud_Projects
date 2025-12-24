# מערכת בלוג מלאה - פתרון מודולרי

פתרון מלא ומודולרי למערכת בלוג עם משתמשים, פוסטים ותגובות.

## מבנה הפרויקט

```
blog-system-solution/
├── server.js              # נקודת הכניסה
├── package.json
├── data/                  # קבצי JSON - מתחילים ריקים
│   ├── users.json
│   ├── posts.json
│   └── comments.json
├── models/                # לוגיקת גישה לנתונים
│   ├── userModel.js
│   ├── postModel.js
│   └── commentModel.js
├── controllers/           # לוגיקת עסקית
│   ├── userController.js
│   ├── postController.js
│   ├── commentController.js
│   └── statsController.js
├── routes/                # הגדרת נתיבים
│   ├── userRoutes.js
│   ├── postRoutes.js
│   ├── commentRoutes.js
│   └── statsRoutes.js
└── middleware/            # Middleware functions
    └── errorHandler.js
```

## התקנה והרצה

```bash
npm install
npm run dev
```

## Endpoints מלאים

### Users API
- `GET /users` - כל המשתמשים
- `GET /users/:id` - משתמש לפי ID
- `GET /users/:id/profile` - פרופיל מלא עם סטטיסטיקות
- `GET /users/:id/posts` - כל הפוסטים של משתמש
- `POST /users` - יצירת משתמש
- `PUT /users/:id` - עדכון משתמש
- `DELETE /users/:id` - מחיקת משתמש

### Posts API
- `GET /posts` - כל הפוסטים (ממוינים)
- `GET /posts/:id` - פוסט לפי ID
- `GET /posts/:id/full` - פוסט מלא עם מחבר ותגובות
- `GET /posts/search?query=<text>` - חיפוש פוסטים
- `GET /posts/tag/:tagName` - פוסטים לפי תג
- `POST /posts` - יצירת פוסט
- `PUT /posts/:id` - עדכון פוסט
- `DELETE /posts/:id` - מחיקת פוסט

### Comments API
- `GET /posts/:postId/comments` - תגובות לפוסט
- `POST /posts/:postId/comments` - הוספת תגובה
- `GET /comments` - כל התגובות
- `DELETE /comments/:id` - מחיקת תגובה

### Stats API
- `GET /stats` - סטטיסטיקות מערכת

## דוגמאות שימוש

### יצירת משתמש
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","email":"john@example.com","name":"John Doe"}'
```

### יצירת פוסט
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Getting Started with Node.js",
    "content":"Node.js is amazing...",
    "authorId":1,
    "tags":["nodejs","javascript"]
  }'
```

### הוספת תגובה
```bash
curl -X POST http://localhost:3000/posts/1/comments \
  -H "Content-Type: application/json" \
  -d '{"authorId":2,"content":"Great post!"}'
```

## תכונות מיוחדות

- **Cascade Delete**: מחיקת פוסט מוחקת אוטומטית את כל התגובות
- **Validation**: בדיקות תקינות לפני יצירה ומחיקה
- **Full Post View**: הצגת פוסט עם כל הנתונים הקשורים
- **Search**: חיפוש בכותרות ותוכן
- **Tags**: תמיכה בתגיות למיון
- **Stats**: סטטיסטיקות מתקדמות

## Deployment

### Render.com

1. צור קובץ `.gitignore`:
```
node_modules/
.env
```

2. העלה ל-GitHub
3. התחבר ל-Render.com
4. צור Web Service חדש
5. חבר את הrepo
6. הגדרות:
   - Build: `npm install`
   - Start: `npm start`

### הגדרות PORT
הקוד תומך באופן אוטומטי ב-`process.env.PORT` עבור deployment.

## ארכיטקטורה

המערכת בנויה בארכיטקטורה מודולרית עם הפרדה ברורה בין שכבות:
- Models - גישה לנתונים
- Controllers - לוגיקה עסקית
- Routes - ניתוב
- Middleware - טיפול בשגיאות

זה מאפשר תחזוקה קלה, הרחבה פשוטה ובדיקות נוחות.
