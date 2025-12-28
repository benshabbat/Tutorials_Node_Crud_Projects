# פרויקט Node.js + Docker + MySQL + phpMyAdmin

פרויקט מלא עם Express.js, MySQL ו-phpMyAdmin הרצים על Docker.

## 📋 תוכן עניינים

- [דרישות מקדימות](#דרישות-מקדימות)
- [התקנה](#התקנה)
- [הרצה](#הרצה)
- [שימוש](#שימוש)
- [API Endpoints](#api-endpoints)
- [פתרון בעיות](#פתרון-בעיות)

## 🔧 דרישות מקדימות

לפני שמתחילים, יש לוודא שמותקנים:

- [Node.js](https://nodejs.org/) (גרסה 14 ומעלה)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## 📦 התקנה

1. **התקנת תלויות Node.js:**
```bash
npm install
```

2. **הגדרת משתני סביבה:**
   - הקובץ `.env` כבר קיים עם הגדרות ברירת מחדל
   - ניתן לערוך את הקובץ בהתאם לצרכים

## 🚀 הרצה

### הפעלת Docker Containers

```bash
# הפעלת MySQL ו-phpMyAdmin
npm run docker:up

# או ישירות עם docker-compose
docker-compose up -d
```

המערכת תקים:
- **MySQL Server** על פורט `3306`
- **phpMyAdmin** על `http://localhost:8080`

### הפעלת שרת Node.js

```bash
# הרצה רגילה
npm start

# או במצב פיתוח (עם nodemon)
npm run dev
```

השרת יעלה על `http://localhost:3000`

## 🎯 שימוש

### גישה ל-phpMyAdmin

1. פתח דפדפן והיכנס ל: `http://localhost:8080`
2. התחבר עם הפרטים:
   - **Server:** `mysql`
   - **Username:** `root`
   - **Password:** `root123` (או כפי שהוגדר ב-.env)

### גישה ל-API

השרת מספק API מלא עבור שתי טבלאות:

#### דף בית
```
GET http://localhost:3000/
```

## 📚 API Endpoints

### משתמשים (Users)

| Method | Endpoint | תיאור |
|--------|----------|-------|
| GET | `/api/users` | קבלת כל המשתמשים |
| GET | `/api/users/:id` | קבלת משתמש לפי ID |
| POST | `/api/users` | יצירת משתמש חדש |
| PUT | `/api/users/:id` | עדכון משתמש |
| DELETE | `/api/users/:id` | מחיקת משתמש |

**דוגמה ליצירת משתמש:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "דני שמש",
    "email": "danny@example.com",
    "age": 30
  }'
```

### מוצרים (Products)

| Method | Endpoint | תיאור |
|--------|----------|-------|
| GET | `/api/products` | קבלת כל המוצרים |
| GET | `/api/products/:id` | קבלת מוצר לפי ID |
| POST | `/api/products` | יצירת מוצר חדש |
| PUT | `/api/products/:id` | עדכון מוצר |
| DELETE | `/api/products/:id` | מחיקת מוצר |

**דוגמה ליצירת מוצר:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "טלפון סלולרי",
    "description": "סמארטפון עם מסך AMOLED",
    "price": 2500.00,
    "stock": 15
  }'
```

## 🐳 פקודות Docker שימושיות

```bash
# עצירת הקונטיינרים
npm run docker:down

# צפייה בלוגים
npm run docker:logs

# הפעלה מחדש של הקונטיינרים
npm run docker:restart

# מחיקת הכל כולל volumes (נתונים)
docker-compose down -v
```

## 🗃️ מבנה בסיס הנתונים

הפרויקט יוצר אוטומטית שתי טבלאות עם נתוני דוגמה:

### טבלת Users
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR)
- email (VARCHAR, UNIQUE)
- age (INT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### טבלת Products
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR)
- description (TEXT)
- price (DECIMAL)
- stock (INT)
- created_at (TIMESTAMP)
```

## 🔍 פתרון בעיות

### בעיה: MySQL לא עולה
```bash
# בדיקת סטטוס הקונטיינרים
docker ps -a

# צפייה בלוגים של MySQL
docker logs mysql_db
```

### בעיה: הפורטים תפוסים
שנה את הפורטים בקובץ `docker-compose.yml`:
```yaml
ports:
  - "3307:3306"  # במקום 3306
```

### בעיה: שגיאת חיבור מ-Node.js
ודא ש:
1. הקונטיינרים של Docker רצים
2. משתני הסביבה ב-`.env` תואמים ל-`docker-compose.yml`
3. המתן מספר שניות לאחר הפעלת Docker עד שה-MySQL מוכן

## 📝 הערות חשובות

- **נתוני הדוגמה** נטענים אוטומטית מהקובץ `init.sql` בפעם הראשונה בלבד
- **הנתונים נשמרים** ב-Docker Volume גם לאחר עצירת הקונטיינרים
- **למחיקת נתונים** יש להשתמש ב-`docker-compose down -v`

## 🌟 תכונות

✅ Docker Compose מוכן לשימוש  
✅ MySQL 8.0 עם הגדרות מיטביות  
✅ phpMyAdmin לניהול ויזואלי  
✅ REST API מלא עם CRUD  
✅ Connection Pooling  
✅ נתוני דוגמה בעברית  
✅ Healthcheck ל-MySQL  
✅ מבנה קוד מסודר  

## 📄 רישיון

ISC
