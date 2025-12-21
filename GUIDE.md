# 🎯 מדריך למתחילים - Node.js שלב אחר שלב

## צעד 1️⃣ - התקנה

1. **הורד Node.js** מ-[nodejs.org](https://nodejs.org)
2. **התקן** (לחץ Next עד הסוף)
3. **בדוק** - פתח Terminal:
   ```bash
   node --version
   ```
   רואה מספר? מעולה! ✅

---

## צעד 2️⃣ - צור פרויקט

פתח Terminal והעתק את הפקודות:

```bash
mkdir my-server
cd my-server
npm init -y
```

עכשיו יש לך תיקייה חדשה עם קובץ `package.json` 📦

---

## צעד 3️⃣ - הגדר את הפרויקט

פתח את הקובץ `package.json` והוסף את השורה `"type": "module"`:

```json
{
  "name": "my-server",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  }
}
```

**למה?** כדי להשתמש ב-`import` (תחביר מודרני) 🚀

---

## צעד 4️⃣ - התקן Express

```bash
npm install express
```

**מה זה Express?** כלי שעוזר לנו לבנות שרת בקלות ⚡

---

## צעד 5️⃣ - צור את השרת

צור קובץ חדש בשם `server.js` והעתק את הקוד:

```javascript
import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('🎉 השרת שלי עובד!');
});

app.listen(PORT, () => {
  console.log(`✅ השרת רץ על http://localhost:${PORT}`);
});
```

---

## צעד 6️⃣ - הרץ את השרת

```bash
node server.js
```

אתה אמור לראות:
```
✅ השרת רץ על http://localhost:3000
```

**פתח בדפדפן:** `http://localhost:3000`

**מזל טוב! 🎊 השרת שלך עובד!**

---

## 💪 שדרוג - שרת עם משתמשים

רוצה להוסיף רשימת משתמשים? עדכן את `server.js`:

```javascript
import express from 'express';

const app = express();
const PORT = 3000;

// כדי לקבל JSON
app.use(express.json());

// רשימת משתמשים
let users = [
  { id: 1, name: 'אליס' },
  { id: 2, name: 'בוב' }
];

// עמוד בית
app.get('/', (req, res) => {
  res.send('🎉 ברוך הבא ל-API שלי!');
});

// ראה את כל המשתמשים
app.get('/users', (req, res) => {
  res.json(users);
});

// ראה משתמש ספציפי
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  res.json(user || { error: 'לא נמצא' });
});

// הוסף משתמש חדש
app.post('/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name
  };
  users.push(newUser);
  res.json(newUser);
});

// מחק משתמש
app.delete('/users/:id', (req, res) => {
  users = users.filter(u => u.id != req.params.id);
  res.json({ message: '✅ נמחק בהצלחה' });
});

app.listen(PORT, () => {
  console.log(`✅ השרת רץ על http://localhost:${PORT}`);
});
```

**הרץ שוב:**
```bash
node server.js
```

---

## 🧪 בדיקה

### בדפדפן:
```
http://localhost:3000/users
```

### ב-PowerShell:

**ראה משתמשים:**
```powershell
Invoke-RestMethod http://localhost:3000/users
```

**הוסף משתמש:**
```powershell
Invoke-RestMethod -Uri http://localhost:3000/users -Method Post -Body '{"name":"דני"}' -ContentType "application/json"
```

**מחק משתמש:**
```powershell
Invoke-RestMethod -Uri http://localhost:3000/users/1 -Method Delete
```

---

## 💡 טיפ חשוב

אם אתה משנה את הקוד והשרת לא מתעדכן - עצור אותו (Ctrl+C) והרץ שוב.

**או השתמש בהרצה אוטומטית:**
```bash
node --watch server.js
```

עכשיו כל שינוי יפעיל מחדש את השרת אוטומטית! 🔄

---

## 📝 סיכום מהיר

**מה עשינו?**
1. ✅ התקנו Node.js
2. ✅ יצרנו פרויקט
3. ✅ התקנו Express
4. ✅ בנינו שרת שעובד
5. ✅ הוספנו רשימת משתמשים

**מה הלאה?**
- 🎨 בנה ממשק משתמש (HTML/React)
- 💾 חבר למסד נתונים (MongoDB)
- 🔐 הוסף התחברות (Authentication)

---

## 🆘 בעיות נפוצות

### השרת לא עובד?
1. בדוק ש-Node.js מותקן: `node --version`
2. בדוק ש-Express מותקן: `npm install`
3. בדוק שהקוד נכון - אין שגיאות?

### הדפדפן לא מראה כלום?
- וודא שהשרת רץ (תראה הודעה בטרמינל)
- בדוק את הכתובת: `http://localhost:3000`

### שינויים לא עובדים?
- עצור את השרת (Ctrl+C)
- הרץ שוב: `node server.js`

---

## 🎉 מעולה!

**עכשיו אתה יודע:**
- ✅ להקים שרת Node.js
- ✅ להשתמש ב-Express
- ✅ לבנות API פשוט
- ✅ לבדוק את השרת

**תרגל ותהיה טוב יותר! 💪**

**בהצלחה! 🚀**
