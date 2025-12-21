# 🚀 התחלה מהירה - שרת עם File System

## מה זה?
שרת Node.js פשוט שמדגים עבודה עם מערכת הקבצים (fs).

## התקנה והרצה

### שלב 1: התקן את החבילות
```bash
npm install
```

### שלב 2: הרץ את השרת
```bash
node simple-fs-server.js
```

או עם auto-reload:
```bash
node --watch simple-fs-server.js
```

### שלב 3: פתח בדפדפן
```
http://localhost:3000
```

## נתיבים זמינים

| Method | נתיב | תיאור |
|--------|------|-------|
| GET | `/` | דף הבית עם הסבר |
| GET | `/read` | קריאת קובץ example.txt |
| POST | `/write` | כתיבת תוכן חדש לקובץ |
| POST | `/append` | הוספת תוכן לקובץ קיים |
| GET | `/list` | רשימת כל הקבצים |
| DELETE | `/delete/:filename` | מחיקת קובץ |
| GET | `/info/:filename` | מידע על קובץ |

## דוגמאות שימוש

### קריאת קובץ
```bash
# בדפדפן או:
curl http://localhost:3000/read
```

### כתיבה לקובץ
```bash
curl -X POST http://localhost:3000/write \
  -H "Content-Type: application/json" \
  -d '{"content": "זה תוכן חדש!"}'
```

### הוספה לקובץ
```bash
curl -X POST http://localhost:3000/append \
  -H "Content-Type: application/json" \
  -d '{"content": "שורה נוספת"}'
```

### רשימת קבצים
```bash
curl http://localhost:3000/list
```

### מחיקת קובץ
```bash
curl -X DELETE http://localhost:3000/delete/example.txt
```

### מידע על קובץ
```bash
curl http://localhost:3000/info/example.txt
```

## טיפים

### בדיקה עם Postman
1. פתח Postman
2. צור בקשה חדשה
3. הגדר Method (GET/POST/DELETE)
4. הכנס URL: `http://localhost:3000/write`
5. בבקשות POST, הוסף Body → raw → JSON:
```json
{
  "content": "התוכן שלי"
}
```

### בדיקה עם VS Code
1. התקן תוסף "REST Client"
2. צור קובץ `test.http`:
```http
### קריאת קובץ
GET http://localhost:3000/read

### כתיבה לקובץ
POST http://localhost:3000/write
Content-Type: application/json

{
  "content": "תוכן חדש מ-VS Code!"
}

### רשימת קבצים
GET http://localhost:3000/list
```

## שגיאות נפוצות

### השרת לא עולה
```
Error: listen EADDRINUSE: address already in use :::3000
```
**פתרון:** יש שרת אחר שרץ על פורט 3000. עצור אותו או שנה את הפורט בקוד.

### קובץ לא נמצא
```
Error: ENOENT: no such file or directory
```
**פתרון:** הקובץ לא קיים. השרת יוצר אותו אוטומטית בפעם הראשונה.

### אין הרשאות
```
Error: EACCES: permission denied
```
**פתרון:** הרץ את הטרמינל עם הרשאות מתאימות או שנה את מיקום הקובץ.

## למידע נוסף
- קרא את [BEGINNERS-GUIDE.md](BEGINNERS-GUIDE.md) למדריך מלא
- בדוק את [server.js](server.js) לדוגמה מורכבת יותר

## רישיון
חופשי לשימוש ולמידה! 🎓
