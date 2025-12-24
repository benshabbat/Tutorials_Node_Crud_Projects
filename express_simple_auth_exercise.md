# תרגיל - Login & Register למתחילים
## Authentication פשוט עם Username + Password בכל בקשה

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

## מטרת התרגיל

לבנות מערכת פשוטה שבה:
- משתמשים יכולים להירשם ולהתחבר
- כל פעולה (POST/PUT/DELETE) דורשת שליחת username + password
- לפני כל פעולה - המערכת מוודאת שהמשתמש קיים והסיסמה נכונה

**הבדל מ-Tokens:** כאן לא שומרים token - פשוט שולחים username ו-password עם כל בקשה.

---

## הכנה: צרו 2 קבצי JSON ריקים

**users.json:**
```json
[]
```

**posts.json:**
```json
[]
```

---

## חלק א': בניית הקוד הבסיסי

### שלב 1: ייבוא מודולים
```javascript
// TODO: ייבאו את express
// TODO: ייבאו את fs/promises
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
```javascript
// TODO: async function readUsers() {
//   קראו את users.json
//   אם יש שגיאה, החזירו []
// }
```

#### writeUsers(users)
```javascript
// TODO: async function writeUsers(users) {
//   שמרו את המערך ל-users.json
// }
```

#### readPosts()
```javascript
// TODO: async function readPosts() {
//   קראו את posts.json
//   אם יש שגיאה, החזירו []
// }
```

#### writePosts(posts)
```javascript
// TODO: async function writePosts(posts) {
//   שמרו את המערך ל-posts.json
// }
```

---

### שלב 4: פונקציית אימות

צרו פונקציה שמוודאת שהמשתמש קיים והסיסמה נכונה:

```javascript
// TODO: async function validateUser(username, password) {
//   1. קראו את רשימת המשתמשים
//   2. מצאו משתמש עם ה-username הזה
//   3. בדקו שהסיסמה שלו תואמת
//   4. אם נמצא וסיסמה נכונה - החזירו את המשתמש
//   5. אם לא - החזירו null
// }
```

**רמז:**
```javascript
async function validateUser(username, password) {
  const users = await readUsers();
  const user = users.find(u => u.username === username && u.password === password);
  return user || null;
}
```

---

## מבנה הנתונים

### User (משתמש):
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Post (פוסט):
```json
{
  "id": 1,
  "title": "My First Post",
  "content": "This is my first post...",
  "authorId": 1,
  "authorUsername": "john_doe"
}
```

---

## חלק ב': Endpoints - Authentication

### 1. GET / (Root Route)
- החזירו הודעת ברוכים הבאים
- **ללא אימות**

```javascript
// TODO: GET /
// החזירו: { message: "Welcome to Simple Auth API" }
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
2. בדקו שה-username לא קיים כבר
3. צרו ID חדש
4. שמרו את המשתמש
5. החזירו את המשתמש החדש (**ללא סיסמה!**)
6. Status: 201

```javascript
// TODO: POST /register
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

### 3. POST /login (בדיקת התחברות)
- בדיקה שהמשתמש והסיסמה נכונים
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
2. מצאו משתמש עם ה-username והסיסמה
3. אם נמצא - החזירו את פרטיו (**ללא סיסמה!**)
4. אם לא - החזירו 401 Unauthorized

```javascript
// TODO: POST /login
```

**תגובה מוצלחת:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

---

## חלק ג': Endpoints - Posts (דורשים אימות)

### 4. GET /posts (קבלת כל הפוסטים)
- החזירו את כל הפוסטים
- **ללא אימות**

```javascript
// TODO: GET /posts
```

---

### 5. POST /posts (יצירת פוסט חדש)
- יצירת פוסט חדש
- **דורש אימות**

**Body:**
```json
{
  "username": "john_doe",
  "password": "password123",
  "title": "My First Post",
  "content": "This is the content..."
}
```

**דרישות:**
1. **קודם כל** - אמתו את המשתמש עם `validateUser()`
2. אם האימות נכשל - החזירו 401 Unauthorized
3. אם האימות הצליח:
   - קראו את הפוסטים
   - צרו פוסט חדש עם authorId ו-authorUsername
   - שמרו
   - החזירו את הפוסט החדש
4. Status: 201

```javascript
// TODO: POST /posts
```

**דוגמת תגובה:**
```json
{
  "id": 1,
  "title": "My First Post",
  "content": "This is the content...",
  "authorId": 1,
  "authorUsername": "john_doe"
}
```

---

### 6. PUT /posts/:id (עדכון פוסט)
- עדכון פוסט קיים
- **דורש אימות**
- **רק המחבר המקורי יכול לעדכן**

**Body:**
```json
{
  "username": "john_doe",
  "password": "password123",
  "title": "Updated Title",
  "content": "Updated content..."
}
```

**דרישות:**
1. **קודם כל** - אמתו את המשתמש
2. אם האימות נכשל - 401
3. קראו את הפוסטים
4. מצאו את הפוסט לפי ID
5. אם הפוסט לא נמצא - 404
6. **בדקו שה-authorId שווה ל-ID של המשתמש המחובר**
7. אם לא - 403 Forbidden
8. עדכנו את הפוסט
9. שמרו והחזירו

```javascript
// TODO: PUT /posts/:id
```

---

### 7. DELETE /posts/:id (מחיקת פוסט)
- מחיקת פוסט
- **דורש אימות**
- **רק המחבר המקורי יכול למחוק**

**Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**דרישות:**
1. אמתו את המשתמש
2. אם האימות נכשל - 401
3. מצאו את הפוסט
4. אם לא נמצא - 404
5. בדקו ownership (authorId === user.id)
6. אם לא - 403
7. מחקו את הפוסט
8. שמרו והחזירו הצלחה

```javascript
// TODO: DELETE /posts/:id
```

---

## חלק ד': Endpoints - User Management

### 8. GET /users (רשימת משתמשים)
- קבלת כל המשתמשים
- **ללא אימות** (לצורך תרגול)

**דרישות:**
- החזירו את כל המשתמשים **ללא סיסמאות!**

```javascript
// TODO: GET /users
```

---

### 9. PUT /profile (עדכון פרופיל)
- עדכון הפרופיל של המשתמש
- **דורש אימות**

**Body:**
```json
{
  "username": "john_doe",
  "password": "password123",
  "email": "newemail@example.com",
  "newPassword": "newpass456"
}
```

**דרישות:**
1. אמתו את המשתמש
2. מצאו אותו ברשימה
3. עדכנו את השדות שנשלחו (email ו/או newPassword)
4. שמרו
5. החזירו את המשתמש המעודכן (**ללא סיסמה!**)

```javascript
// TODO: PUT /profile
```

---

### 10. DELETE /account (מחיקת חשבון)
- מחיקת החשבון של המשתמש
- **דורש אימות**

**Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**דרישות:**
1. אמתו את המשתמש
2. מחקו אותו מהמערך
3. **בונוס:** מחקו גם את כל הפוסטים שלו
4. שמרו והחזירו הצלחה

```javascript
// TODO: DELETE /account
```

---

## חלק ה': הרצת השרת

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
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com"
}
```

---

### 2. התחברות (בדיקה)
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"password123"}'
```

**תגובה:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

---

### 3. יצירת פוסט (עם אימות)
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

---

### 4. עדכון פוסט (עם אימות)
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

---

### 5. מחיקת פוסט (עם אימות)
```bash
curl -X DELETE http://localhost:3000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

---

## שגיאות נפוצות

### 401 Unauthorized
```json
{
  "message": "Unauthorized: Invalid username or password"
}
```
**פתרון:** בדקו את ה-username והסיסמה

### 403 Forbidden
```json
{
  "message": "Forbidden: You can only modify your own posts"
}
```
**פתרון:** רק המחבר יכול לערוך/למחוק את הפוסט

### 404 Not Found
```json
{
  "message": "Post not found"
}
```
**פתרון:** ה-ID לא קיים

---

## טיפים חשובים

### 1. תבנית endpoint עם אימות:
```javascript
app.post('/posts', async (req, res) => {
  // שלב 1: חלץ את פרטי האימות
  const { username, password, ...postData } = req.body;
  
  // שלב 2: אמת את המשתמש
  const user = await validateUser(username, password);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized: Invalid username or password' });
  }
  
  // שלב 3: בצע את הפעולה
  // ... קוד יצירת הפוסט
});
```

### 2. הסרת שדות מאובייקט:
```javascript
const { password, ...userWithoutPassword } = user;
// או
const { username, password, ...postData } = req.body;
```

### 3. בדיקת ownership:
```javascript
if (post.authorId !== user.id) {
  return res.status(403).json({ message: 'Forbidden: Not your post' });
}
```

### 4. החזרת משתמש ללא סיסמה:
```javascript
const { id, username, email } = user;
res.json({ id, username, email });
```

---

## אתגר בונוס

### 11. GET /posts/my (הפוסטים שלי)
- החזירו רק את הפוסטים של המשתמש המחובר
- **דורש אימות**

**Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

```javascript
// TODO: GET /posts/my
// אמתו משתמש והחזירו רק את הפוסטים שה-authorId שלהם תואם
```

---

## סיכום

תרגיל זה מדגים:

✅ מערכת Register/Login פשוטה  
✅ אימות משתמשים בכל בקשה (ללא tokens)  
✅ שליחת credentials ב-request body  
✅ בדיקות ownership (רק המחבר יכול לערוך)  
✅ הסרת מידע רגיש (סיסמאות) מתגובות  
✅ ניהול משתמשים ופוסטים

**הבדל מ-Tokens:** כאן שולחים username+password עם **כל בקשה**, במקום לשמור token אחד ולהשתמש בו.

---

<details>
<summary><strong>📖 רמזים ופתרונות (לחצו כדי לפתוח)</strong></summary>

## פתרון מלא

<details>
<summary>קוד התחלתי מלא</summary>

```javascript
import express from 'express';
import fs from 'fs/promises';

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

async function readPosts() {
  try {
    const data = await fs.readFile('posts.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writePosts(posts) {
  await fs.writeFile('posts.json', JSON.stringify(posts, null, 2));
}

// Validation function
async function validateUser(username, password) {
  const users = await readUsers();
  const user = users.find(u => u.username === username && u.password === password);
  return user || null;
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
<summary>1. GET / - Root</summary>

```javascript
app.get('/', (req, res) => {
  res.json({ 
    message: "Welcome to Simple Auth API",
    note: "Send username and password in body for POST/PUT/DELETE operations"
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
  
  // בדיקת ייחודיות
  if (users.some(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  
  const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
  
  const newUser = {
    id: maxId + 1,
    username,
    email,
    password
  };
  
  users.push(newUser);
  await writeUsers(users);
  
  // החזר ללא סיסמה
  const { password: _, ...userResponse } = newUser;
  res.status(201).json(userResponse);
});
```
</details>

<details>
<summary>3. POST /login - התחברות</summary>

```javascript
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await validateUser(username, password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  
  const { password: _, ...userResponse } = user;
  res.json({
    message: "Login successful",
    user: userResponse
  });
});
```
</details>

<details>
<summary>4. GET /posts - כל הפוסטים</summary>

```javascript
app.get('/posts', async (req, res) => {
  const posts = await readPosts();
  res.json(posts);
});
```
</details>

<details>
<summary>5. POST /posts - יצירת פוסט (עם אימות)</summary>

```javascript
app.post('/posts', async (req, res) => {
  const { username, password, title, content } = req.body;
  
  // אימות
  const user = await validateUser(username, password);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized: Invalid username or password' });
  }
  
  // יצירת פוסט
  const posts = await readPosts();
  const maxId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) : 0;
  
  const newPost = {
    id: maxId + 1,
    title,
    content,
    authorId: user.id,
    authorUsername: user.username
  };
  
  posts.push(newPost);
  await writePosts(posts);
  res.status(201).json(newPost);
});
```
</details>

<details>
<summary>6. PUT /posts/:id - עדכון פוסט (עם אימות ו-ownership)</summary>

```javascript
app.put('/posts/:id', async (req, res) => {
  const postId = parseInt(req.params.id);
  const { username, password, title, content } = req.body;
  
  // אימות
  const user = await validateUser(username, password);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized: Invalid username or password' });
  }
  
  // מציאת פוסט
  const posts = await readPosts();
  const postIndex = posts.findIndex(p => p.id === postId);
  
  if (postIndex === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }
  
  // בדיקת ownership
  if (posts[postIndex].authorId !== user.id) {
    return res.status(403).json({ message: 'Forbidden: You can only modify your own posts' });
  }
  
  // עדכון
  posts[postIndex] = {
    ...posts[postIndex],
    title,
    content
  };
  
  await writePosts(posts);
  res.json(posts[postIndex]);
});
```
</details>

<details>
<summary>7. DELETE /posts/:id - מחיקת פוסט (עם אימות ו-ownership)</summary>

```javascript
app.delete('/posts/:id', async (req, res) => {
  const postId = parseInt(req.params.id);
  const { username, password } = req.body;
  
  // אימות
  const user = await validateUser(username, password);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized: Invalid username or password' });
  }
  
  // מציאת פוסט
  const posts = await readPosts();
  const post = posts.find(p => p.id === postId);
  
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  
  // בדיקת ownership
  if (post.authorId !== user.id) {
    return res.status(403).json({ message: 'Forbidden: You can only delete your own posts' });
  }
  
  // מחיקה
  const filteredPosts = posts.filter(p => p.id !== postId);
  await writePosts(filteredPosts);
  res.json({ message: 'Post deleted successfully' });
});
```
</details>

<details>
<summary>8. GET /users - רשימת משתמשים</summary>

```javascript
app.get('/users', async (req, res) => {
  const users = await readUsers();
  
  // הסר סיסמאות
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
<summary>9. PUT /profile - עדכון פרופיל</summary>

```javascript
app.put('/profile', async (req, res) => {
  const { username, password, email, newPassword } = req.body;
  
  // אימות
  const user = await validateUser(username, password);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized: Invalid username or password' });
  }
  
  // עדכון
  const users = await readUsers();
  const userIndex = users.findIndex(u => u.id === user.id);
  
  if (email) {
    users[userIndex].email = email;
  }
  
  if (newPassword) {
    users[userIndex].password = newPassword;
  }
  
  await writeUsers(users);
  
  const { password: _, ...userResponse } = users[userIndex];
  res.json(userResponse);
});
```
</details>

<details>
<summary>10. DELETE /account - מחיקת חשבון</summary>

```javascript
app.delete('/account', async (req, res) => {
  const { username, password } = req.body;
  
  // אימות
  const user = await validateUser(username, password);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized: Invalid username or password' });
  }
  
  // מחיקת משתמש
  const users = await readUsers();
  const filteredUsers = users.filter(u => u.id !== user.id);
  await writeUsers(filteredUsers);
  
  // בונוס: מחיקת פוסטים
  const posts = await readPosts();
  const filteredPosts = posts.filter(p => p.authorId !== user.id);
  await writePosts(filteredPosts);
  
  res.json({ message: 'Account and all posts deleted successfully' });
});
```
</details>

<details>
<summary>11. GET /posts/my - הפוסטים שלי (בונוס)</summary>

```javascript
app.get('/posts/my', async (req, res) => {
  const { username, password } = req.body;
  
  // אימות
  const user = await validateUser(username, password);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized: Invalid username or password' });
  }
  
  // סינון
  const posts = await readPosts();
  const myPosts = posts.filter(p => p.authorId === user.id);
  
  res.json(myPosts);
});
```

**שימו לב:** GET עם body הוא לא נפוץ, אבל עובד. בדרך כלל נשתמש ב-POST או query parameters.
</details>

</details>

---

בהצלחה! 🔐✨
