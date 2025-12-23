# תרגיל מתקדם - מערכת בלוג מלאה + Deployment
## עבודה עם 3 קבצי JSON (מתחילים ריקים) + פריסה לאינטרנט

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

## מטרה

לבנות API מלא למערכת בלוג עם משתמשים, פוסטים ותגובות, כולל קשרים מורכבים בין הישויות, ולהעלות את המערכת לאינטרנט

---

## הכנה: צרו 3 קבצי JSON ריקים

**users.json:**
```json
[]
```

**posts.json:**
```json
[]
```

**comments.json:**
```json
[]
```

---

## תרגיל הכנה: קוד התחלתי

צרו קובץ `server.js` עם המבנה הבא:

### שלב 1: ייבוא מודולים
```javascript
// TODO: ייבאו את express
// TODO: ייבאו את fs/promises
```

### שלב 2: הגדרות בסיסיות
```javascript
// TODO: צרו אפליקציית express
// TODO: הגדירו את ה-PORT (השתמשו ב-process.env.PORT || 3000 ל-deployment)
// TODO: הוסיפו middleware לטיפול ב-JSON
```

### שלב 3: Helper Functions

צרו 6 פונקציות עזר:
- `readUsers()` - קריאת משתמשים מהקובץ
- `writeUsers(users)` - שמירת משתמשים לקובץ
- `readPosts()` - קריאת פוסטים מהקובץ
- `writePosts(posts)` - שמירת פוסטים לקובץ
- `readComments()` - קריאת תגובות מהקובץ
- `writeComments(comments)` - שמירת תגובות לקובץ

**רמז:** כל פונקציית read צריכה להחזיר מערך ריק במקרה של שגיאה

```javascript
// TODO: async function readUsers() { ... }
// TODO: async function writeUsers(users) { ... }
// TODO: async function readPosts() { ... }
// TODO: async function writePosts(posts) { ... }
// TODO: async function readComments() { ... }
// TODO: async function writeComments(comments) { ... }
```

### שלב 4: Root Route (בדיקת תקינות)
```javascript
// TODO: GET / - החזירו הודעה שהשרת פועל
// דוגמה: { message: "Blog API is running", version: "1.0.0" }
```

### שלב 5: הפעלת השרת
```javascript
// TODO: app.listen(PORT, () => { ... });
// TODO: הדפיסו הודעה שהשרת רץ
```

---

## מבנה הנתונים

### User (משתמש):
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "name": "John Doe"
}
```

### Post (פוסט):
```json
{
  "id": 1,
  "title": "My First Blog Post",
  "content": "This is the content of my first post...",
  "authorId": 1,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "tags": ["javascript", "tutorial"]
}
```

### Comment (תגובה):
```json
{
  "id": 1,
  "postId": 1,
  "authorId": 2,
  "content": "Great post! Thanks for sharing.",
  "createdAt": "2024-01-15T12:45:00.000Z"
}
```

---

## חלק א': ניהול משתמשים (Users)

### 1. GET /users
- החזירו את כל המשתמשים

**TODO:** יישמו route זה

---

### 2. GET /users/:id
- החזירו משתמש ספציפי
- 404 אם לא נמצא

**TODO:** יישמו route זה

---

### 3. POST /users
- הוסיפו משתמש חדש
- ID אוטומטי
- Body: `{ "username": "...", "email": "...", "name": "..." }`
- **בדיקה:** וודאו שה-username ייחודי
- status 201

**TODO:** יישמו route זה

---

### 4. PUT /users/:id
- עדכנו פרטי משתמש
- 404 אם לא נמצא

**TODO:** יישמו route זה

---

### 5. DELETE /users/:id
- מחקו משתמש
- **בדיקה חשובה:** וודאו שאין למשתמש פוסטים או תגובות
- אם יש, החזירו שגיאה 400
- 404 אם לא נמצא

**TODO:** יישמו route זה

---

## חלק ב': ניהול פוסטים (Posts)

### 6. GET /posts
- החזירו את כל הפוסטים
- **בונוס:** מיין לפי תאריך (החדש ביותר קודם)

**TODO:** יישמו route זה

---

### 7. GET /posts/:id
- החזירו פוסט ספציפי
- 404 אם לא נמצא

**TODO:** יישמו route זה

---

### 8. POST /posts
- הוסיפו פוסט חדש
- ID אוטומטי
- הוסיפו `createdAt` אוטומטית: `new Date().toISOString()`
- Body: `{ "title": "...", "content": "...", "authorId": 1, "tags": [...] }`
- **בדיקה:** וודאו שה-authorId קיים
- status 201

**TODO:** יישמו route זה

---

### 9. PUT /posts/:id
- עדכנו פוסט
- **בדיקה:** רק המחבר המקורי יכול לעדכן (authorId זהה)
- 403 אם לא המחבר
- 404 אם לא נמצא

**TODO:** יישמו route זה

---

### 10. DELETE /posts/:id
- מחקו פוסט
- **אוטומטית:** מחקו גם את כל התגובות של הפוסט
- 404 אם לא נמצא

**TODO:** יישמו route זה

---

## חלק ג': ניהול תגובות (Comments)

### 11. GET /comments
- החזירו את כל התגובות

**TODO:** יישמו route זה

---

### 12. GET /posts/:postId/comments
- החזירו את כל התגובות של פוסט ספציפי
- מיין לפי תאריך (הישן ביותר קודם)
- 404 אם הפוסט לא נמצא

**TODO:** יישמו route זה

---

### 13. POST /posts/:postId/comments
- הוסיפו תגובה לפוסט
- ID אוטומטי
- הוסיפו `createdAt` אוטומטית
- Body: `{ "authorId": 2, "content": "..." }`
- **בדיקה:** וודאו שהפוסט והמשתמש קיימים
- status 201

**TODO:** יישמו route זה

---

### 14. DELETE /comments/:id
- מחקו תגובה
- **בדיקה:** רק המחבר המקורי יכול למחוק
- 403 אם לא המחבר
- 404 אם לא נמצאה

**TODO:** יישמו route זה

---

## חלק ד': Routes מורכבים (עם נתונים מקושרים)

### 15. GET /users/:id/posts
- החזירו את כל הפוסטים של משתמש ספציפי
- כולל מספר התגובות לכל פוסט
- פורמט:
```json
[
  {
    "id": 1,
    "title": "...",
    "content": "...",
    "authorId": 1,
    "createdAt": "...",
    "tags": [...],
    "commentsCount": 5
  }
]
```
- 404 אם המשתמש לא נמצא

**TODO:** יישמו route זה

---

### 16. GET /posts/:id/full
- החזירו פוסט עם כל המידע המלא:
  - פרטי הפוסט
  - פרטי המחבר (name, username)
  - רשימת התגובות עם פרטי כותביהן
  
פורמט:
```json
{
  "post": {
    "id": 1,
    "title": "...",
    "content": "...",
    "createdAt": "...",
    "tags": [...]
  },
  "author": {
    "id": 1,
    "username": "john_doe",
    "name": "John Doe"
  },
  "comments": [
    {
      "id": 1,
      "content": "...",
      "createdAt": "...",
      "author": {
        "id": 2,
        "username": "jane_smith",
        "name": "Jane Smith"
      }
    }
  ]
}
```
- 404 אם הפוסט לא נמצא

**TODO:** יישמו route זה

---

### 17. GET /users/:id/profile
- החזירו פרופיל מלא של משתמש:
  - פרטי המשתמש
  - מספר הפוסטים
  - מספר התגובות
  - רשימת הפוסטים האחרונים (5 פוסטים)

פורמט:
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "name": "John Doe"
  },
  "stats": {
    "postsCount": 10,
    "commentsCount": 25
  },
  "recentPosts": [...]
}
```
- 404 אם המשתמש לא נמצא

**TODO:** יישמו route זה

---

## חלק ה': חיפוש וסינון

### 18. GET /posts/search?query=javascript
- חפשו פוסטים לפי מילת חיפוש
- חפשו ב-title ו-content (case-insensitive)

**TODO:** יישמו route זה

---

### 19. GET /posts/tag/:tagName
- החזירו כל הפוסטים עם תג מסוים
- דוגמה: `/posts/tag/javascript`

**TODO:** יישמו route זה

---

### 20. GET /stats
- החזירו סטטיסטיקות כלליות:
  - מספר משתמשים
  - מספר פוסטים
  - מספר תגובות
  - המשתמש הפעיל ביותר (הכי הרבה פוסטים)
  - הפוסט הפופולרי ביותר (הכי הרבה תגובות)

**TODO:** יישמו route זה

---

## דוגמאות בדיקה

### הוספת משתמשים
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","email":"john@example.com","name":"John Doe"}'

curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"username":"jane_smith","email":"jane@example.com","name":"Jane Smith"}'
```

### הוספת פוסט
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Getting Started with Node.js","content":"Node.js is amazing...","authorId":1,"tags":["nodejs","javascript","tutorial"]}'
```

### הוספת תגובה
```bash
curl -X POST http://localhost:3000/posts/1/comments \
  -H "Content-Type: application/json" \
  -d '{"authorId":2,"content":"Great tutorial! Thanks for sharing."}'
```

### שאילתות מורכבות
```bash
# כל הפוסטים של משתמש
curl http://localhost:3000/users/1/posts

# פוסט מלא עם תגובות
curl http://localhost:3000/posts/1/full

# חיפוש פוסטים
curl http://localhost:3000/posts/search?query=nodejs

# פוסטים לפי תג
curl http://localhost:3000/posts/tag/javascript
```

---

## חלק ו': Deployment - העלאה לאינטרנט

### אופציה 1: Render.com (חינם)

#### שלב 1: הכנת הפרויקט
1. וודאו שיש לכם קובץ `.gitignore`:
```
node_modules/
.env
*.json
```

2. צרו קובץ `README.md` עם הסבר על הפרויקט

#### שלב 2: העלאה ל-GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

#### שלב 3: פריסה ב-Render
1. היכנסו ל-[Render.com](https://render.com)
2. צרו חשבון (אפשר עם GitHub)
3. לחצו על "New +" ובחרו "Web Service"
4. חברו את ה-repository מ-GitHub
5. הגדרות:
   - **Name:** blog-api (או שם אחר)
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
6. לחצו "Create Web Service"
7. המתינו לפריסה (כ-2-3 דקות)
8. תקבלו URL כמו: `https://blog-api-xxxx.onrender.com`

#### בדיקה:
```bash
curl https://your-app.onrender.com/
curl https://your-app.onrender.com/users
```

---

### אופציה 2: Railway.app (חינם)

#### שלב 1: התקנת Railway CLI
```bash
npm install -g @railway/cli
```

#### שלב 2: התחברות
```bash
railway login
```

#### שלב 3: פריסה
```bash
railway init
railway up
```

#### שלב 4: הצגת ה-URL
```bash
railway domain
```

---

### אופציה 3: Vercel (לפרויקטים קטנים)

#### שלב 1: התקנת Vercel CLI
```bash
npm install -g vercel
```

#### שלב 2: צרו קובץ `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

#### שלב 3: פריסה
```bash
vercel
```

---

### טיפים חשובים ל-Deployment

#### 1. שימוש ב-Environment Variables
```javascript
const PORT = process.env.PORT || 3000;
```

#### 2. הוספת CORS (אם צריך)
```bash
npm install cors
```

```javascript
import cors from 'cors';
app.use(cors());
```

#### 3. Error Handling גלובלי
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
```

#### 4. בדיקת תקינות
```javascript
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

#### 5. Logging
הוסיפו לוגים לפעולות חשובות:
```javascript
console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
```

---

## אתגר בונוס: הוספת Features

### 1. Like System
הוסיפו מערך `likes: []` לכל פוסט עם IDs של משתמשים
- `POST /posts/:id/like` - הוספת לייק
- `DELETE /posts/:id/like` - הסרת לייק

### 2. Pagination
הוסיפו לכל רשימה:
- `?page=1&limit=10`
- החזירו גם: `{ data: [...], page: 1, totalPages: 5, total: 47 }`

### 3. Sorting
הוסיפו לפוסטים:
- `?sortBy=createdAt&order=desc`
- `?sortBy=title&order=asc`

---

## סיכום המערכת

מערכת זו מדגימה:

✅ עבודה עם 3 קבצי JSON נפרדים  
✅ קשרים מורכבים בין ישויות (users → posts → comments)  
✅ CRUD מלא על כל ישות  
✅ Routes מורכבים עם נתונים מקושרים  
✅ בדיקות תקינות מתקדמות  
✅ חיפוש וסינון  
✅ Deployment לאינטרנט  
✅ Best practices לייצור

---

<details>
<summary><strong>📖 רמזים ופתרונות (לחצו כדי לפתוח)</strong></summary>

## פתרון לקוד ההתחלתי

<details>
<summary>קוד התחלתי מלא</summary>

```javascript
import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = process.env.PORT || 3000;

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

async function readComments() {
  try {
    const data = await fs.readFile('comments.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeComments(comments) {
  await fs.writeFile('comments.json', JSON.stringify(comments, null, 2));
}

// Root route
app.get('/', (req, res) => {
  res.json({ message: "Blog API is running", version: "1.0.0" });
});

// TODO: יישמו את כל ה-endpoints

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```
</details>

---

## טיפים חשובים

### 1. בדיקת קיום משתמש/פוסט/תגובה:
```javascript
const users = await readUsers();
const user = users.find(u => u.id === userId);

if (!user) {
  return res.status(404).json({ message: 'User not found' });
}
```

### 2. בדיקת ייחודיות username:
```javascript
const users = await readUsers();
const exists = users.some(u => u.username === req.body.username);

if (exists) {
  return res.status(400).json({ message: 'Username already exists' });
}
```

### 3. מחיקת פוסט עם התגובות שלו:
```javascript
const comments = await readComments();
const filteredComments = comments.filter(c => c.postId !== postId);
await writeComments(filteredComments);
```

### 4. ספירת תגובות לפוסט:
```javascript
const comments = await readComments();
const commentsCount = comments.filter(c => c.postId === postId).length;
```

### 5. מיון פוסטים לפי תאריך:
```javascript
posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
```

### 6. חיפוש case-insensitive:
```javascript
const query = req.query.query.toLowerCase();
const results = posts.filter(p => 
  p.title.toLowerCase().includes(query) || 
  p.content.toLowerCase().includes(query)
);
```

### 7. סינון לפי תג:
```javascript
const tagName = req.params.tagName.toLowerCase();
const results = posts.filter(p => 
  p.tags.some(tag => tag.toLowerCase() === tagName)
);
```

---

## פתרונות מלאים

### חלק א': משתמשים

<details>
<summary>GET /users - פתרון</summary>

```javascript
app.get('/users', async (req, res) => {
  const users = await readUsers();
  res.json(users);
});
```
</details>

<details>
<summary>POST /users - פתרון עם בדיקת ייחודיות</summary>

```javascript
app.post('/users', async (req, res) => {
  const users = await readUsers();
  
  // בדיקת ייחודיות
  const exists = users.some(u => u.username === req.body.username);
  if (exists) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  
  const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
  
  const newUser = {
    id: maxId + 1,
    username: req.body.username,
    email: req.body.email,
    name: req.body.name
  };
  
  users.push(newUser);
  await writeUsers(users);
  res.status(201).json(newUser);
});
```
</details>

<details>
<summary>DELETE /users/:id - פתרון עם בדיקה</summary>

```javascript
app.delete('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  const users = await readUsers();
  const posts = await readPosts();
  const comments = await readComments();
  
  // בדיקה אם יש פוסטים או תגובות
  const hasPosts = posts.some(p => p.authorId === userId);
  const hasComments = comments.some(c => c.authorId === userId);
  
  if (hasPosts || hasComments) {
    return res.status(400).json({ 
      message: 'Cannot delete user with existing posts or comments' 
    });
  }
  
  const filteredUsers = users.filter(u => u.id !== userId);
  
  if (filteredUsers.length === users.length) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  await writeUsers(filteredUsers);
  res.json({ message: 'User deleted successfully' });
});
```
</details>

---

### חלק ב': פוסטים

<details>
<summary>POST /posts - פתרון עם בדיקת author</summary>

```javascript
app.post('/posts', async (req, res) => {
  const users = await readUsers();
  const posts = await readPosts();
  
  // בדיקת קיום המשתמש
  const author = users.find(u => u.id === req.body.authorId);
  if (!author) {
    return res.status(404).json({ message: 'Author not found' });
  }
  
  const maxId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) : 0;
  
  const newPost = {
    id: maxId + 1,
    title: req.body.title,
    content: req.body.content,
    authorId: req.body.authorId,
    createdAt: new Date().toISOString(),
    tags: req.body.tags || []
  };
  
  posts.push(newPost);
  await writePosts(posts);
  res.status(201).json(newPost);
});
```
</details>

<details>
<summary>PUT /posts/:id - פתרון עם בדיקת ownership</summary>

```javascript
app.put('/posts/:id', async (req, res) => {
  const postId = parseInt(req.params.id);
  const posts = await readPosts();
  const index = posts.findIndex(p => p.id === postId);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }
  
  // בדיקת ownership
  if (posts[index].authorId !== req.body.authorId) {
    return res.status(403).json({ message: 'Forbidden: Not the author' });
  }
  
  posts[index] = {
    ...posts[index],
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags
  };
  
  await writePosts(posts);
  res.json(posts[index]);
});
```
</details>

<details>
<summary>DELETE /posts/:id - פתרון עם מחיקת תגובות</summary>

```javascript
app.delete('/posts/:id', async (req, res) => {
  const postId = parseInt(req.params.id);
  const posts = await readPosts();
  const comments = await readComments();
  
  const filteredPosts = posts.filter(p => p.id !== postId);
  
  if (filteredPosts.length === posts.length) {
    return res.status(404).json({ message: 'Post not found' });
  }
  
  // מחיקת תגובות
  const filteredComments = comments.filter(c => c.postId !== postId);
  
  await writePosts(filteredPosts);
  await writeComments(filteredComments);
  res.json({ message: 'Post and its comments deleted successfully' });
});
```
</details>

---

### חלק ג': תגובות

<details>
<summary>POST /posts/:postId/comments - פתרון מלא</summary>

```javascript
app.post('/posts/:postId/comments', async (req, res) => {
  const postId = parseInt(req.params.postId);
  const posts = await readPosts();
  const users = await readUsers();
  const comments = await readComments();
  
  // בדיקת קיום פוסט
  const post = posts.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  
  // בדיקת קיום משתמש
  const author = users.find(u => u.id === req.body.authorId);
  if (!author) {
    return res.status(404).json({ message: 'Author not found' });
  }
  
  const maxId = comments.length > 0 ? Math.max(...comments.map(c => c.id)) : 0;
  
  const newComment = {
    id: maxId + 1,
    postId,
    authorId: req.body.authorId,
    content: req.body.content,
    createdAt: new Date().toISOString()
  };
  
  comments.push(newComment);
  await writeComments(comments);
  res.status(201).json(newComment);
});
```
</details>

---

### חלק ד': Routes מורכבים

<details>
<summary>GET /users/:id/posts - פתרון עם ספירת תגובות</summary>

```javascript
app.get('/users/:id/posts', async (req, res) => {
  const userId = parseInt(req.params.id);
  const users = await readUsers();
  const posts = await readPosts();
  const comments = await readComments();
  
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const userPosts = posts
    .filter(p => p.authorId === userId)
    .map(post => ({
      ...post,
      commentsCount: comments.filter(c => c.postId === post.id).length
    }));
  
  res.json(userPosts);
});
```
</details>

<details>
<summary>GET /posts/:id/full - פתרון מלא עם כל הנתונים</summary>

```javascript
app.get('/posts/:id/full', async (req, res) => {
  const postId = parseInt(req.params.id);
  const posts = await readPosts();
  const users = await readUsers();
  const comments = await readComments();
  
  const post = posts.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  
  const author = users.find(u => u.id === post.authorId);
  
  const postComments = comments
    .filter(c => c.postId === postId)
    .map(comment => {
      const commentAuthor = users.find(u => u.id === comment.authorId);
      return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        author: {
          id: commentAuthor.id,
          username: commentAuthor.username,
          name: commentAuthor.name
        }
      };
    });
  
  res.json({
    post: {
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      tags: post.tags
    },
    author: {
      id: author.id,
      username: author.username,
      name: author.name
    },
    comments: postComments
  });
});
```
</details>

<details>
<summary>GET /users/:id/profile - פתרון מלא</summary>

```javascript
app.get('/users/:id/profile', async (req, res) => {
  const userId = parseInt(req.params.id);
  const users = await readUsers();
  const posts = await readPosts();
  const comments = await readComments();
  
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const userPosts = posts.filter(p => p.authorId === userId);
  const userComments = comments.filter(c => c.authorId === userId);
  
  const recentPosts = userPosts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  
  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name
    },
    stats: {
      postsCount: userPosts.length,
      commentsCount: userComments.length
    },
    recentPosts
  });
});
```
</details>

---

### חלק ה': חיפוש וסינון

<details>
<summary>GET /posts/search - פתרון</summary>

```javascript
app.get('/posts/search', async (req, res) => {
  const query = (req.query.query || '').toLowerCase();
  const posts = await readPosts();
  
  const results = posts.filter(p => 
    p.title.toLowerCase().includes(query) || 
    p.content.toLowerCase().includes(query)
  );
  
  res.json(results);
});
```
</details>

<details>
<summary>GET /posts/tag/:tagName - פתרון</summary>

```javascript
app.get('/posts/tag/:tagName', async (req, res) => {
  const tagName = req.params.tagName.toLowerCase();
  const posts = await readPosts();
  
  const results = posts.filter(p => 
    p.tags.some(tag => tag.toLowerCase() === tagName)
  );
  
  res.json(results);
});
```
</details>

<details>
<summary>GET /stats - פתרון מלא</summary>

```javascript
app.get('/stats', async (req, res) => {
  const users = await readUsers();
  const posts = await readPosts();
  const comments = await readComments();
  
  // המשתמש הפעיל ביותר
  const userPostCounts = users.map(user => ({
    user,
    postsCount: posts.filter(p => p.authorId === user.id).length
  }));
  
  const mostActiveUser = userPostCounts.reduce((max, curr) =>
    curr.postsCount > (max?.postsCount || 0) ? curr : max
  , null);
  
  // הפוסט הפופולרי ביותר
  const postCommentCounts = posts.map(post => ({
    post,
    commentsCount: comments.filter(c => c.postId === post.id).length
  }));
  
  const mostPopularPost = postCommentCounts.reduce((max, curr) =>
    curr.commentsCount > (max?.commentsCount || 0) ? curr : max
  , null);
  
  res.json({
    totalUsers: users.length,
    totalPosts: posts.length,
    totalComments: comments.length,
    mostActiveUser: mostActiveUser ? {
      id: mostActiveUser.user.id,
      username: mostActiveUser.user.username,
      postsCount: mostActiveUser.postsCount
    } : null,
    mostPopularPost: mostPopularPost ? {
      id: mostPopularPost.post.id,
      title: mostPopularPost.post.title,
      commentsCount: mostPopularPost.commentsCount
    } : null
  });
});
```
</details>

</details>

---

בהצלחה! 🚀 תהנו מהפרויקט ומהפריסה לאינטרנט! 🌐
