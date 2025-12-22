# 🔧 מדריך Middleware ב-Express למתחילים

## 🤔 מה זה Middleware?

**Middleware** (תוכנת ביניים) היא פונקציה שרצה **בין** קבלת הבקשה (Request) לבין שליחת התשובה (Response).

### דמיון מהחיים
תחשוב על שומר בכניסה לאולם אירועים:
1. 👤 אדם מגיע (Request)
2. 🔍 השומר בודק הזמנה (Middleware)
3. ✅ אם בסדר - מכניס פנימה (Next)
4. 🎉 האדם מגיע למסיבה (Response)

---

## 📊 איך Middleware עובד?

```javascript
app.use((req, res, next) => {
  // קוד שרץ לפני כל endpoint
  console.log('בקשה התקבלה!');
  next(); // מעביר לפונקציה הבאה
});
```

**שרשרת ביצוע:**
```
Request → Middleware 1 → Middleware 2 → Route Handler → Response
```

---

## 🔑 המבנה הבסיסי

### פונקציית Middleware מקבלת 3 פרמטרים:

```javascript
function myMiddleware(req, res, next) {
  // req  - אובייקט הבקשה
  // res  - אובייקט התשובה
  // next - פונקציה שמעבירה לשלב הבא
  
  // עשה משהו
  console.log('Middleware רץ!');
  
  // העבר לשלב הבא
  next();
}
```

⚠️ **חשוב:** אם לא קוראים ל-`next()`, הבקשה תתקע ולא תמשיך!

---

## 📝 סוגי Middleware

### 1️⃣ Application-level Middleware
רץ על כל הבקשות באפליקציה:

```javascript
// רץ על כל בקשה
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// רץ רק על נתיב מסוים
app.use('/api', (req, res, next) => {
  console.log('API endpoint נגיש');
  next();
});
```

### 2️⃣ Router-level Middleware
רץ על Router ספציפי:

```javascript
import express from 'express';
const router = express.Router();

router.use((req, res, next) => {
  console.log('Router middleware');
  next();
});

router.get('/users', (req, res) => {
  res.send('Users list');
});
```

### 3️⃣ Built-in Middleware
Middleware מובנה של Express:

```javascript
// לקריאת JSON
app.use(express.json());

// לקריאת URL-encoded data
app.use(express.urlencoded({ extended: true }));

// להגשת קבצים סטטיים
app.use(express.static('public'));
```

### 4️⃣ Third-party Middleware
חבילות חיצוניות:

```javascript
import cors from 'cors';
import morgan from 'morgan';

// CORS - גישה ממקורות שונים
app.use(cors());

// Morgan - logging מתקדם
app.use(morgan('dev'));
```

### 5️⃣ Error-handling Middleware
טיפול בשגיאות (4 פרמטרים!):

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'משהו השתבש!',
    message: err.message
  });
});
```

---

## 🎯 דוגמאות מעשיות

### 1. Logger - תיעוד בקשות

```javascript
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

app.use(logger);
```

**תוצאה:**
```
[2025-12-22T10:30:00.000Z] GET /users
[2025-12-22T10:30:05.000Z] POST /users
```

### 2. Authentication - אימות משתמשים

```javascript
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API Key חסר' });
  }
  
  if (apiKey !== 'secret-key-123') {
    return res.status(403).json({ error: 'API Key לא תקין' });
  }
  
  // המשתמש מאומת!
  next();
};

// הגן על נתיבים מסוימים
app.get('/public', (req, res) => {
  res.send('פתוח לכולם');
});

app.get('/private', authenticate, (req, res) => {
  res.send('רק למי שמאומת!');
});
```

### 3. Request Timer - מדידת זמן תגובה

```javascript
const requestTimer = (req, res, next) => {
  req.startTime = Date.now();
  
  // Hook לסוף התגובה
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    console.log(`בקשה לקחה ${duration}ms`);
  });
  
  next();
};

app.use(requestTimer);
```

### 4. Validation - אימות נתונים

```javascript
const validateUser = (req, res, next) => {
  const { name, email } = req.body;
  
  if (!name || name.length < 2) {
    return res.status(400).json({ error: 'שם לא תקין' });
  }
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'אימייל לא תקין' });
  }
  
  // הנתונים תקינים
  next();
};

app.post('/users', validateUser, (req, res) => {
  // הנתונים כבר מאומתים כאן!
  res.json({ message: 'משתמש נוצר' });
});
```

### 5. Rate Limiting - הגבלת קצב

```javascript
const requestCounts = {}; // בפרודקשן: השתמש ב-Redis

const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  
  if (!requestCounts[ip]) {
    requestCounts[ip] = { count: 1, resetTime: now + 60000 }; // דקה
    return next();
  }
  
  if (now > requestCounts[ip].resetTime) {
    requestCounts[ip] = { count: 1, resetTime: now + 60000 };
    return next();
  }
  
  if (requestCounts[ip].count >= 10) {
    return res.status(429).json({ error: 'יותר מדי בקשות. נסה שוב בעוד דקה' });
  }
  
  requestCounts[ip].count++;
  next();
};

app.use(rateLimiter);
```

---

## 🔄 סדר ביצוע חשוב!

```javascript
import express from 'express';
const app = express();

// 1. הכי כללי - רץ ראשון
app.use((req, res, next) => {
  console.log('1: Global middleware');
  next();
});

// 2. Built-in middleware
app.use(express.json());

// 3. Middleware ספציפי לנתיב
app.use('/api', (req, res, next) => {
  console.log('2: API middleware');
  next();
});

// 4. Routes
app.get('/api/users', (req, res) => {
  console.log('3: Route handler');
  res.json({ message: 'Users' });
});

// 5. Error handler - רץ אחרון!
app.use((err, req, res, next) => {
  console.log('4: Error handler');
  res.status(500).json({ error: err.message });
});
```

**תוצאה:**
```
1: Global middleware
2: API middleware
3: Route handler
```

---

## ⚡ Middleware עם async/await

```javascript
// ❌ לא נכון - שגיאות לא נתפסות!
app.use(async (req, res, next) => {
  const data = await fetchData(); // אם נכשל, השרת יקרוס!
  req.data = data;
  next();
});

// ✅ נכון - עוטפים ב-try/catch
app.use(async (req, res, next) => {
  try {
    const data = await fetchData();
    req.data = data;
    next();
  } catch (err) {
    next(err); // מעביר את השגיאה ל-error handler
  }
});

// ✅ עוד יותר נכון - wrapper function
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.use(asyncHandler(async (req, res, next) => {
  const data = await fetchData();
  req.data = data;
  next();
}));
```

---

## 🎨 תבניות שימושיות

### מבנה של Middleware מותאם אישית

```javascript
// middleware/logger.js
export const logger = (options = {}) => {
  const { format = 'short' } = options;
  
  return (req, res, next) => {
    if (format === 'short') {
      console.log(`${req.method} ${req.url}`);
    } else {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - IP: ${req.ip}`);
    }
    next();
  };
};

// שימוש
import { logger } from './middleware/logger.js';

app.use(logger({ format: 'detailed' }));
```

### Middleware עם הגדרות

```javascript
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role; // נניח שיש אובייקט user
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'אין הרשאה' });
    }
    
    next();
  };
};

// שימוש
app.delete('/users/:id', 
  authenticate, 
  checkRole(['admin', 'moderator']), 
  (req, res) => {
    res.json({ message: 'User deleted' });
  }
);
```

---

## 🐛 שגיאות נפוצות

### 1. שכחת לקרוא ל-next()

```javascript
// ❌ הבקשה תתקע!
app.use((req, res, next) => {
  console.log('Log something');
  // שכחנו next()!
});

// ✅ נכון
app.use((req, res, next) => {
  console.log('Log something');
  next(); // ✅
});
```

### 2. קריאה ל-next() אחרי res.send()

```javascript
// ❌ שגיאה: Cannot set headers after they are sent
app.use((req, res, next) => {
  res.send('Response');
  next(); // ❌ מנסה להמשיך אחרי שסיימנו!
});

// ✅ נכון - או response או next
app.use((req, res, next) => {
  if (someCondition) {
    return res.send('Response'); // return מונע המשך
  }
  next(); // רק אם לא שלחנו response
});
```

### 3. סדר לא נכון

```javascript
// ❌ Error handler לפני routes
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.get('/users', (req, res) => {
  res.json({ users: [] });
});

// ✅ Error handler תמיד אחרון!
app.get('/users', (req, res) => {
  res.json({ users: [] });
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
```

---

## 📦 דוגמה מלאה - מערכת אימות

```javascript
// middleware/auth.js
export const auth = {
  // בדיקת API Key
  verifyApiKey: (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(401).json({ 
        error: 'API Key is required',
        hint: 'Add x-api-key header'
      });
    }
    
    // בדיקה מול מסד נתונים (דוגמה פשוטה)
    const validKeys = ['key-123', 'key-456'];
    
    if (!validKeys.includes(apiKey)) {
      return res.status(403).json({ 
        error: 'Invalid API Key' 
      });
    }
    
    // שמירת מידע על המשתמש
    req.apiKeyUser = { id: 1, name: 'User' };
    next();
  },
  
  // בדיקת הרשאות
  requireRole: (roles) => {
    return (req, res, next) => {
      if (!req.apiKeyUser) {
        return res.status(401).json({ 
          error: 'Authentication required' 
        });
      }
      
      const userRole = req.apiKeyUser.role || 'user';
      
      if (!roles.includes(userRole)) {
        return res.status(403).json({ 
          error: 'Insufficient permissions' 
        });
      }
      
      next();
    };
  },
  
  // Logging של גישות
  logAccess: (req, res, next) => {
    const timestamp = new Date().toISOString();
    const user = req.apiKeyUser?.name || 'Anonymous';
    console.log(`[${timestamp}] ${user} accessed ${req.method} ${req.url}`);
    next();
  }
};

// server.js
import express from 'express';
import { auth } from './middleware/auth.js';

const app = express();
app.use(express.json());

// נתיבים ציבוריים
app.get('/public', (req, res) => {
  res.json({ message: 'Public endpoint' });
});

// נתיבים מוגנים
app.get('/private', 
  auth.verifyApiKey,
  auth.logAccess,
  (req, res) => {
    res.json({ 
      message: 'Private data',
      user: req.apiKeyUser 
    });
  }
);

// רק למנהלים
app.delete('/users/:id',
  auth.verifyApiKey,
  auth.requireRole(['admin']),
  auth.logAccess,
  (req, res) => {
    res.json({ message: `User ${req.params.id} deleted` });
  }
);

app.listen(3000);
```

---

## ✅ Best Practices

### 1. שמור middleware בקבצים נפרדים
```
project/
├── middleware/
│   ├── auth.js
│   ├── logger.js
│   ├── validation.js
│   └── errorHandler.js
└── server.js
```

### 2. תן שמות ברורים
```javascript
// ❌ לא ברור
const m1 = (req, res, next) => { ... };

// ✅ ברור
const authenticateUser = (req, res, next) => { ... };
```

### 3. השתמש ב-async wrapper
```javascript
// Utility function
export const asyncMiddleware = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

### 4. הוסף תיעוד
```javascript
/**
 * Validates user data before creating/updating
 * @param {Object} req.body - User data
 * @param {string} req.body.name - User name (required, min 2 chars)
 * @param {string} req.body.email - User email (required, valid format)
 * @returns {void} Calls next() if valid, sends 400 if invalid
 */
export const validateUser = (req, res, next) => {
  // ...
};
```

### 5. טפל בשגיאות
```javascript
// תמיד הוסף error handler אחרון
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});
```

---

## 🎯 מתי להשתמש ב-Middleware?

✅ **כן:**
- תיעוד (logging)
- אימות (authentication)
- בדיקת הרשאות (authorization)
- אימות נתונים (validation)
- הגבלת קצב (rate limiting)
- CORS
- טיפול בשגיאות
- דחיסת תגובות (compression)

❌ **לא:**
- לוגיקה עסקית מורכבת (שים ב-services)
- פעולות ספציפיות לroute אחד (שים ישירות ב-route)
- חישובים כבדים שלא נוגעים לבקשה

---

## 📚 למידה נוספת

1. **דוגמאות:** [`examples/hebrew/middleware-examples.js`](../../examples/hebrew/middleware-examples.js)
2. **תרגילים:** [`exercises/hebrew/middleware-exercises.md`](../../exercises/hebrew/middleware-exercises.md)
3. **תיעוד רשמי:** [Express Middleware](https://expressjs.com/en/guide/using-middleware.html)

---

## 🎓 סיכום

| מושג | הסבר | דוגמה |
|------|------|-------|
| `req` | אובייקט הבקשה | `req.body`, `req.params` |
| `res` | אובייקט התשובה | `res.json()`, `res.send()` |
| `next()` | העבר לשלב הבא | `next()` או `next(err)` |
| Application-level | רץ על כל האפליקציה | `app.use(...)` |
| Router-level | רץ על router ספציפי | `router.use(...)` |
| Error handler | 4 פרמטרים | `(err, req, res, next)` |

---

**עכשיו אתה יודע Middleware! 🎉**

המשך ל:
- [דוגמאות מעשיות](../../examples/hebrew/middleware-examples.js)
- [תרגילים](../../exercises/hebrew/middleware-exercises.md)
- [פרויקט מלא](../../projects/)
