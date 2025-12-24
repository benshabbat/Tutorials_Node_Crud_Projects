# פתרון מודולרי - מערכת סטודנטים וקורסים

פתרון מלא ומודולרי למערכת ניהול סטודנטים וקורסים עם קשרים ביניהם.

## מבנה הפרויקט

```
students-courses-solution/
├── server.js              # נקודת הכניסה
├── package.json
├── data/                  # קבצי JSON - מתחילים ריקים
│   ├── students.json
│   └── courses.json
├── models/                # לוגיקת גישה לנתונים
│   ├── studentModel.js
│   └── courseModel.js
├── controllers/           # לוגיקת עסקית
│   ├── studentController.js
│   ├── courseController.js
│   └── statsController.js
├── routes/                # הגדרת נתיבים
│   ├── studentRoutes.js
│   ├── courseRoutes.js
│   └── statsRoutes.js
└── middleware/            # Middleware functions
    └── errorHandler.js
```

## התקנה והרצה

```bash
npm install
npm run dev
```

## Endpoints

### Students API

- `GET /students` - כל הסטודנטים
- `GET /students/:id` - סטודנט לפי ID
- `GET /students/search?name=John` - חיפוש לפי שם
- `POST /students` - יצירת סטודנט חדש
- `PUT /students/:id` - עדכון סטודנט
- `DELETE /students/:id` - מחיקת סטודנט
- `POST /students/:studentId/enroll/:courseId` - רישום לקורס
- `DELETE /students/:studentId/unenroll/:courseId` - ביטול רישום
- `GET /students/:studentId/courses` - קורסים של סטודנט

### Courses API

- `GET /courses` - כל הקורסים
- `GET /courses/:id` - קורס לפי ID
- `GET /courses/search?instructor=David` - חיפוש לפי מרצה
- `GET /courses/search?minCredits=3&maxCredits=5` - חיפוש לפי נקודות זכות
- `POST /courses` - יצירת קורס חדש
- `PUT /courses/:id` - עדכון קורס
- `DELETE /courses/:id` - מחיקת קורס
- `GET /courses/:courseId/students` - סטודנטים בקורס

### Stats API

- `GET /stats` - סטטיסטיקות מערכת

## דוגמאות שימוש

### יצירת סטודנט
```bash
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

### יצירת קורס
```bash
curl -X POST http://localhost:3000/courses \
  -H "Content-Type: application/json" \
  -d '{"name":"JavaScript for Beginners","instructor":"David Brown","credits":4}'
```

### רישום סטודנט לקורס
```bash
curl -X POST http://localhost:3000/students/1/enroll/1
```

## תכונות מיוחדות

- **בדיקת תקינות**: מערכת בודקת שלא מוחקים קורס עם סטודנטים רשומים
- **קשרים**: מערכת מנהלת קשר רב-לרב בין סטודנטים לקורסים
- **חיפוש מתקדם**: חיפוש לפי מספר פרמטרים
- **סטטיסטיקות**: מציג קורס פופולרי וסטודנט פעיל

## ארכיטקטורה

הפרויקט בנוי בשכבות נפרדות לקלות תחזוקה והרחבה.
