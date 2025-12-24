# תרגיל - Authentication עם Headers
## Login, Register ועבודה עם HTTP Headers למתחילים

## הגדרות התחלתיות

```bash
npm init -y
npm install express
```

**הוסיפו ל-package.json:**
```json
{
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  }
}
```

---

## מה זה Headers?

HTTP Headers הם מטא-דאטה שנשלח עם כל בקשה ותגובה. הם מכילים מידע כמו:
- `Content-Type` - סוג התוכן (JSON, HTML, וכו')
- `Authorization` - מידע אימות (טוקן, סיסמה)
- `User-Agent` - פרטי הדפדפן/לקוח
- Headers מותאמים אישית

### דוגמה לבקשה עם Headers:
```bash
curl http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer my-secret-token" \
  -H "Custom-Header: my-value"
```

### קריאת Headers ב-Express:
```javascript
app.get('/example', (req, res) => {
  const contentType = req.headers['content-type'];
  const auth = req.headers['authorization'];
  const customHeader = req.headers['custom-header'];
  
  console.log('Content-Type:', contentType);
  console.log('Authorization:', auth);
  console.log('Custom Header:', customHeader);
});
```

---

## מטרת התרגיל

לבנות מערכת אימות פשוטה עם:
- **Register** - הרשמת משתמש חדש
- **Login** - התחברות וקבלת טוקן
- **Protected Routes** - נתיבים שדורשים אימות דרך Headers

---

## הכנה: צרו קובץ JSON ריק

**users.json:**
```json
[]
```

---

## חלק א': בניית הקוד הבסיסי

### שלב 1: ייבוא מודולים
```javascript
// TODO: ייבאו את express
// TODO: ייבאו את fs/promises
// TODO: ייבאו את crypto (מובנה ב-Node.js) - ליצירת טוכנים
```

**רמז:**
```javascript
import crypto from 'crypto';
```

---

### שלב 2: הגדרות בסיסיות
```javascript
// TODO: צרו אפליקציית express
// TODO: הגדירו את ה-PORT (3000)
// TODO: הוסיפו middleware לטיפול ב-JSON
```

---

### שלב 3: Helper Functions

#### readUsers()
צרו פונקציה שקוראת את רשימת המשתמשים:
```javascript
// TODO: async function readUsers() {
//   קראו את users.json
//   אם יש שגיאה, החזירו []
// }
```

#### writeUsers(users)
צרו פונקציה ששומרת את רשימת המשתמשים:
```javascript
// TODO: async function writeUsers(users) {
//   שמרו את המערך ל-users.json
// }
```

#### generateToken()
צרו פונקציה שיוצרת טוקן ייחודי:
```javascript
// TODO: function generateToken() {
//   החזירו מחרוזת אקראית באורך 32 תווים
//   רמז: crypto.randomBytes(16).toString('hex')
// }
```

---

### שלב 4: Middleware לאימות

צרו middleware שבודק אם יש טוכן תקין ב-Header:

```javascript
// TODO: function authMiddleware(req, res, next) {
//   1. קראו את ה-Authorization header
//   2. בדקו אם הוא מתחיל ב-"Bearer "
//   3. חלצו את הטוכן (הטקסט אחרי "Bearer ")
//   4. קראו את רשימת המשתמשים
//   5. מצאו משתמש עם הטוכן הזה
//   6. אם נמצא - שמרו את המשתמש ב-req.user וקראו ל-next()
//   7. אם לא נמצא - החזירו 401 Unauthorized
// }
```

**רמז לפורמט Authorization:**
```
Authorization: Bearer abc123xyz456
```

---

## חלק ב': Endpoints

### מבנה נתונים של User:
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "token": "abc123xyz456"
}
```

**הערה:** בפרודקשיין אסור לשמור סיסמאות בטקסט פשוט! זה רק לתרגול.

---

### 1. GET / (Root Route)
- החזירו הודעת ברוכים הבאים
- **ללא אימות**

```javascript
// TODO: GET / 
// החזירו: { message: "Welcome to Auth API", endpoints: [...] }
```

---

### 2. POST /register (הרשמה)
- הרשמת משתמש חדש
- **ללא אימות**

**Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**דרישות:**
1. קראו את רשימת המשתמשים
2. בדקו שה-username לא קיים
3. בדקו שה-email לא קיים
4. צרו ID חדש
5. צרו טוכן חדש עם `generateToken()`
6. שמרו את המשתמש
7. **אל תחזירו את הסיסמה בתגובה!**
8. החזירו: `{ user: { id, username, email }, token }`
9. Status: 201

```javascript
// TODO: POST /register
```

**דוגמת תגובה:**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "abc123xyz456"
}
```

---

### 3. POST /login (התחברות)
- התחברות עם username וסיסמה
- **ללא אימות**

**Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**דרישות:**
1. קראו את רשימת המשתמשים
2. מצאו משתמש עם ה-username
3. בדקו שהסיסמה נכונה
4. אם לא נמצא או סיסמה שגויה - 401 Unauthorized
5. צרו טוכן חדש (כדי לבטל טוכנים ישנים)
6. עדכנו את המשתמש עם הטוכן החדש
7. החזירו: `{ user: { id, username, email }, token }`

```javascript
// TODO: POST /login
```

---

### 4. GET /profile (פרופיל משתמש)
- קבלת פרטי המשתמש המחובר
- **דורש אימות** - השתמשו ב-`authMiddleware`

**Headers נדרשים:**
```
Authorization: Bearer <your-token>
```

**דרישות:**
1. המשתמש כבר זמין ב-`req.user` (תודות ל-middleware)
2. החזירו את פרטי המשתמש (**ללא סיסמה!**)

```javascript
// TODO: GET /profile - עם authMiddleware
```

**דוגמת תגובה:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com"
}
```

---

### 5. PUT /profile (עדכון פרופיל)
- עדכון פרטי המשתמש המחובר
- **דורש אימות**

**Headers נדרשים:**
```
Authorization: Bearer <your-token>
```

**Body:**
```json
{
  "email": "newemail@example.com",
  "password": "newpassword123"
}
```

**דרישות:**
1. קבלו את המשתמש מ-`req.user`
2. עדכנו את השדות שנשלחו (email ו/או password)
3. שמרו את השינויים
4. החזירו את המשתמש המעודכן (**ללא סיסמה!**)

```javascript
// TODO: PUT /profile - עם authMiddleware
```

---

### 6. POST /logout (התנתקות)
- ביטול הטוכן הנוכחי
- **דורש אימות**

**Headers נדרשים:**
```
Authorization: Bearer <your-token>
```

**דרישות:**
1. קבלו את המשתמש מ-`req.user`
2. מחקו/אפסו את הטוכן שלו (שמרו `null` או מחרוזת ריקה)
3. שמרו את השינויים
4. החזירו: `{ message: "Logged out successfully" }`

```javascript
// TODO: POST /logout - עם authMiddleware
```

---

### 7. GET /users (רשימת משתמשים)
- קבלת כל המשתמשים
- **דורש אימות**

**Headers נדרשים:**
```
Authorization: Bearer <your-token>
```

**דרישות:**
1. קראו את כל המשתמשים
2. החזירו אותם **ללא סיסמאות וטוכנים!**

```javascript
// TODO: GET /users - עם authMiddleware
```

**דוגמת תגובה:**
```json
[
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  {
    "id": 2,
    "username": "jane_smith",
    "email": "jane@example.com"
  }
]
```

---

### 8. DELETE /account (מחיקת חשבון)
- מחיקת החשבון של המשתמש המחובר
- **דורש אימות**

**Headers נדרשים:**
```
Authorization: Bearer <your-token>
```

**דרישות:**
1. קבלו את המשתמש מ-`req.user`
2. מחקו אותו מהמערך
3. שמרו את השינויים
4. החזירו: `{ message: "Account deleted successfully" }`

```javascript
// TODO: DELETE /account - עם authMiddleware
```

---

## חלק ג': הרצת השרת

```javascript
// TODO: app.listen(PORT, () => { ... });
```

---

## דוגמאות שימוש

### 1. הרשמה
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

---

### 2. התחברות
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"password123"}'
```

**תגובה:**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "x9y8z7w6v5u4t3s2r1q0p9o8n7m6l5k4"
}
```

---

### 3. קבלת פרופיל (עם טוכן)
```bash
curl http://localhost:3000/profile \
  -H "Authorization: Bearer x9y8z7w6v5u4t3s2r1q0p9o8n7m6l5k4"
```

**תגובה:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com"
}
```

---

### 4. עדכון פרופיל
```bash
curl -X PUT http://localhost:3000/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer x9y8z7w6v5u4t3s2r1q0p9o8n7m6l5k4" \
  -d '{"email":"newemail@example.com"}'
```

---

### 5. רשימת משתמשים (דורש אימות)
```bash
curl http://localhost:3000/users \
  -H "Authorization: Bearer x9y8z7w6v5u4t3s2r1q0p9o8n7m6l5k4"
```

---

### 6. התנתקות
```bash
curl -X POST http://localhost:3000/logout \
  -H "Authorization: Bearer x9y8z7w6v5u4t3s2r1q0p9o8n7m6l5k4"
```

---

### 7. מחיקת חשבון
```bash
curl -X DELETE http://localhost:3000/account \
  -H "Authorization: Bearer x9y8z7w6v5u4t3s2r1q0p9o8n7m6l5k4"
```

---

## שגיאות נפוצות

### 401 Unauthorized
```json
{
  "message": "Unauthorized: Invalid or missing token"
}
```
**פתרון:** בדקו שה-Header `Authorization` קיים ותקין

### 400 Bad Request
```json
{
  "message": "Username already exists"
}
```
**פתרון:** בחרו username אחר

### 403 Forbidden
```json
{
  "message": "Forbidden"
}
```
**פתרון:** אין לכם הרשאה לפעולה זו

---

## טיפים חשובים

### 1. קריאת Authorization Header:
```javascript
const authHeader = req.headers['authorization'];
// או
const authHeader = req.get('Authorization');
```

### 2. חילוץ טוכן מ-Bearer:
```javascript
const token = authHeader.split(' ')[1]; // "Bearer token123" -> "token123"
```

### 3. הסרת שדות מאובייקט:
```javascript
const { password, token, ...userWithoutSensitiveData } = user;
```

### 4. שימוש ב-Middleware:
```javascript
// ללא אימות
app.get('/public', (req, res) => { ... });

// עם אימות
app.get('/protected', authMiddleware, (req, res) => { ... });
```

---

## אתגר בונוס: Custom Headers

### 9. GET /custom-headers (תרגול Headers)
- endpoint שמדפיס את כל ה-headers שנשלחו
- **ללא אימות**

```javascript
// TODO: GET /custom-headers
// החזירו את כל req.headers
```

**שימוש:**
```bash
curl http://localhost:3000/custom-headers \
  -H "X-Custom-1: value1" \
  -H "X-Custom-2: value2" \
  -H "User-Agent: MyApp/1.0"
```

---

## סיכום

תרגיל זה מדגים:

✅ עבודה עם HTTP Headers  
✅ מערכת Register/Login פשוטה  
✅ אימות משתמשים עם Tokens  
✅ Middleware לאבטחת Routes  
✅ קריאה ושליחה של Headers  
✅ Protected Routes (נתיבים מוגנים)

---

<details>
<summary><strong>📖 רמזים ופתרונות (לחצו כדי לפתוח)</strong></summary>

## פתרון מלא

<details>
<summary>קוד התחלתי מלא</summary>

```javascript
import express from 'express';
import fs from 'fs/promises';
import crypto from 'crypto';

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper functions
async function readUsers() {
  try {
    const data = await fs.readFile('users.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeUsers(users) {
  await fs.writeFile('users.json', JSON.stringify(users, null, 2));
}

function generateToken() {
  return crypto.randomBytes(16).toString('hex');
}

// Auth Middleware
async function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
  }
  
  const token = authHeader.split(' ')[1];
  const users = await readUsers();
  const user = users.find(u => u.token === token);
  
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
  
  req.user = user;
  next();
}

// TODO: Endpoints

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```
</details>

---

## פתרונות ל-Endpoints

<details>
<summary>1. GET / - Root Route</summary>

```javascript
app.get('/', (req, res) => {
  res.json({
    message: "Welcome to Auth API",
    endpoints: [
      "POST /register - Register new user",
      "POST /login - Login user",
      "GET /profile - Get user profile (auth required)",
      "PUT /profile - Update profile (auth required)",
      "POST /logout - Logout (auth required)",
      "GET /users - Get all users (auth required)",
      "DELETE /account - Delete account (auth required)"
    ]
  });
});
```
</details>

<details>
<summary>2. POST /register - הרשמה</summary>

```javascript
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const users = await readUsers();
  
  // בדיקת ייחודיות username
  if (users.some(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  
  // בדיקת ייחודיות email
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }
  
  const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
  const token = generateToken();
  
  const newUser = {
    id: maxId + 1,
    username,
    email,
    password, // בפרודקשיין - hash!
    token
  };
  
  users.push(newUser);
  await writeUsers(users);
  
  // אל תחזיר סיסמה
  const { password: _, ...userWithoutPassword } = newUser;
  
  res.status(201).json({
    user: { id: newUser.id, username: newUser.username, email: newUser.email },
    token
  });
});
```
</details>

<details>
<summary>3. POST /login - התחברות</summary>

```javascript
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const users = await readUsers();
  
  const user = users.find(u => u.username === username);
  
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  
  // יצירת טוכן חדש
  const token = generateToken();
  user.token = token;
  await writeUsers(users);
  
  res.json({
    user: { id: user.id, username: user.username, email: user.email },
    token
  });
});
```
</details>

<details>
<summary>4. GET /profile - פרופיל משתמש</summary>

```javascript
app.get('/profile', authMiddleware, async (req, res) => {
  const { id, username, email } = req.user;
  res.json({ id, username, email });
});
```
</details>

<details>
<summary>5. PUT /profile - עדכון פרופיל</summary>

```javascript
app.put('/profile', authMiddleware, async (req, res) => {
  const { email, password } = req.body;
  const users = await readUsers();
  
  const userIndex = users.findIndex(u => u.id === req.user.id);
  
  if (email) {
    users[userIndex].email = email;
  }
  
  if (password) {
    users[userIndex].password = password;
  }
  
  await writeUsers(users);
  
  const { id, username, email: updatedEmail } = users[userIndex];
  res.json({ id, username, email: updatedEmail });
});
```
</details>

<details>
<summary>6. POST /logout - התנתקות</summary>

```javascript
app.post('/logout', authMiddleware, async (req, res) => {
  const users = await readUsers();
  const userIndex = users.findIndex(u => u.id === req.user.id);
  
  users[userIndex].token = null;
  await writeUsers(users);
  
  res.json({ message: 'Logged out successfully' });
});
```
</details>

<details>
<summary>7. GET /users - רשימת משתמשים</summary>

```javascript
app.get('/users', authMiddleware, async (req, res) => {
  const users = await readUsers();
  
  // הסר סיסמאות וטוכנים
  const safeUsers = users.map(({ id, username, email }) => ({
    id,
    username,
    email
  }));
  
  res.json(safeUsers);
});
```
</details>

<details>
<summary>8. DELETE /account - מחיקת חשבון</summary>

```javascript
app.delete('/account', authMiddleware, async (req, res) => {
  const users = await readUsers();
  const filteredUsers = users.filter(u => u.id !== req.user.id);
  
  await writeUsers(filteredUsers);
  
  res.json({ message: 'Account deleted successfully' });
});
```
</details>

<details>
<summary>9. GET /custom-headers - בונוס</summary>

```javascript
app.get('/custom-headers', (req, res) => {
  res.json({
    message: 'All headers received:',
    headers: req.headers
  });
});
```
</details>

---

## פתרון ל-authMiddleware

```javascript
async function authMiddleware(req, res, next) {
  // קריאת ה-Authorization header
  const authHeader = req.headers['authorization'];
  
  // בדיקה אם הוא קיים ומתחיל ב-Bearer
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'Unauthorized: Missing or invalid token format' 
    });
  }
  
  // חילוץ הטוכן
  const token = authHeader.split(' ')[1];
  
  // חיפוש משתמש עם הטוכן
  const users = await readUsers();
  const user = users.find(u => u.token === token);
  
  if (!user) {
    return res.status(401).json({ 
      message: 'Unauthorized: Invalid token' 
    });
  }
  
  // שמירת המשתמש ב-request
  req.user = user;
  next();
}
```

---

## טיפים נוספים

### איך לבדוק Headers בקוד?
```javascript
app.get('/debug', (req, res) => {
  console.log('All headers:', req.headers);
  console.log('Authorization:', req.headers['authorization']);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('User-Agent:', req.headers['user-agent']);
  
  res.json({ headers: req.headers });
});
```

### איך להגדיר Headers בתגובה?
```javascript
app.get('/example', (req, res) => {
  res.set('X-Custom-Header', 'my-value');
  res.set('X-Powered-By', 'MyApp');
  res.json({ message: 'Check response headers!' });
});
```

### איך לבדוק Headers בדפדפן?
1. פתחו Developer Tools (F12)
2. לכו ל-Network tab
3. שלחו בקשה
4. לחצו על הבקשה
5. בחרו Headers

</details>

---

בהצלחה! 🔐🚀
