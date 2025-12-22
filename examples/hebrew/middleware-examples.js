// 🔧 דוגמאות Middleware - Express
// שרת מלא עם כל סוגי ה-Middleware

import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = 3000;

// Built-in Middleware
app.use(express.json());

// ===================================
// 1️⃣ Logger Middleware - תיעוד בקשות
// ===================================

const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip;
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  next();
};

// הפעל על כל הבקשות
app.use(logger);

// ===================================
// 2️⃣ Request Timer - מדידת זמן תגובה
// ===================================

const requestTimer = (req, res, next) => {
  req.startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    console.log(`⏱️  בקשה ל-${req.url} לקחה ${duration}ms`);
  });
  
  next();
};

app.use(requestTimer);

// ===================================
// 3️⃣ API Key Authentication - אימות
// ===================================

const apiKeys = {
  'key-123': { id: 1, name: 'User One', role: 'user' },
  'key-456': { id: 2, name: 'Admin User', role: 'admin' },
  'key-789': { id: 3, name: 'Moderator', role: 'moderator' }
};

const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ 
      error: 'API Key חסר',
      hint: 'הוסף header: x-api-key'
    });
  }
  
  const user = apiKeys[apiKey];
  
  if (!user) {
    return res.status(403).json({ 
      error: 'API Key לא תקין' 
    });
  }
  
  // שמור את פרטי המשתמש ב-request
  req.user = user;
  console.log(`✅ משתמש מאומת: ${user.name} (${user.role})`);
  next();
};

// ===================================
// 4️⃣ Role-based Authorization - הרשאות
// ===================================

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'אימות נדרש' 
      });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'אין הרשאה מספקת',
        required: allowedRoles,
        current: req.user.role
      });
    }
    
    next();
  };
};

// ===================================
// 5️⃣ Rate Limiter - הגבלת קצב
// ===================================

const requestCounts = {};

const rateLimiter = (maxRequests = 10, windowMs = 60000) => {
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    
    if (!requestCounts[ip]) {
      requestCounts[ip] = { count: 1, resetTime: now + windowMs };
      return next();
    }
    
    // אפס מונה אם עבר הזמן
    if (now > requestCounts[ip].resetTime) {
      requestCounts[ip] = { count: 1, resetTime: now + windowMs };
      return next();
    }
    
    // בדוק אם עבר את הגבול
    if (requestCounts[ip].count >= maxRequests) {
      const resetIn = Math.ceil((requestCounts[ip].resetTime - now) / 1000);
      return res.status(429).json({ 
        error: 'יותר מדי בקשות',
        message: `נסה שוב בעוד ${resetIn} שניות`,
        limit: maxRequests,
        resetIn: resetIn
      });
    }
    
    requestCounts[ip].count++;
    next();
  };
};

// הפעל על כל endpoint
app.use(rateLimiter(20, 60000)); // 20 בקשות לדקה

// ===================================
// 6️⃣ Validation Middleware - אימות נתונים
// ===================================

const validateUser = (req, res, next) => {
  const { name, email, age } = req.body;
  const errors = [];
  
  // בדוק שם
  if (!name || name.trim().length < 2) {
    errors.push('שם חייב להכיל לפחות 2 תווים');
  }
  
  // בדוק אימייל
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('אימייל לא תקין');
  }
  
  // בדוק גיל (אם נשלח)
  if (age !== undefined) {
    if (typeof age !== 'number' || age < 0 || age > 150) {
      errors.push('גיל חייב להיות מספר בין 0 ל-150');
    }
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'נתונים לא תקינים',
      details: errors
    });
  }
  
  next();
};

// ===================================
// 7️⃣ Async Wrapper - עוטף לפונקציות async
// ===================================

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ===================================
// 8️⃣ Request Logger to File - שמירה לקובץ
// ===================================

const LOG_FILE = './logs/requests.log';

const fileLogger = asyncHandler(async (req, res, next) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    ip: req.ip,
    user: req.user?.name || 'Anonymous'
  };
  
  try {
    await fs.mkdir('./logs', { recursive: true });
    await fs.appendFile(LOG_FILE, JSON.stringify(logEntry) + '\n');
  } catch (err) {
    console.error('❌ שגיאה בשמירת לוג:', err.message);
  }
  
  next();
});

// ===================================
// דף הבית - מידע על ה-API
// ===================================

app.get('/', (req, res) => {
  res.json({
    message: '🔧 Middleware Examples API',
    description: 'דוגמאות מעשיות ל-Middleware',
    endpoints: {
      public: {
        'GET /': 'דף הבית',
        'GET /info': 'מידע על השרת',
        'GET /test-rate-limit': 'בדיקת rate limiter'
      },
      authenticated: {
        'GET /profile': 'פרופיל משתמש (דורש API Key)',
        'POST /users': 'יצירת משתמש (דורש API Key)',
        'GET /logs': 'צפייה בלוגים (דורש API Key)'
      },
      admin: {
        'DELETE /users/:id': 'מחיקת משתמש (רק admin)',
        'GET /stats': 'סטטיסטיקות (admin/moderator)'
      }
    },
    authentication: {
      header: 'x-api-key',
      validKeys: {
        'key-123': 'User (role: user)',
        'key-456': 'Admin (role: admin)',
        'key-789': 'Moderator (role: moderator)'
      }
    },
    rateLimiting: {
      limit: 20,
      window: '60 seconds'
    }
  });
});

// ===================================
// נתיבים ציבוריים
// ===================================

app.get('/info', (req, res) => {
  res.json({
    message: 'Server Information',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    node: process.version
  });
});

app.get('/test-rate-limit', (req, res) => {
  res.json({
    message: 'בקשה התקבלה!',
    tip: 'נסה לשלוח 21 בקשות בדקה אחת - תקבל שגיאת 429'
  });
});

// ===================================
// נתיבים מאומתים
// ===================================

app.get('/profile', authenticate, (req, res) => {
  res.json({
    message: 'פרופיל משתמש',
    user: req.user
  });
});

// יצירת משתמש - עם אימות ו-validation
app.post('/users', authenticate, validateUser, (req, res) => {
  const newUser = {
    id: Date.now(),
    ...req.body,
    createdBy: req.user.name,
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json({
    message: 'משתמש נוצר בהצלחה',
    user: newUser
  });
});

// צפייה בלוגים
app.get('/logs', authenticate, fileLogger, asyncHandler(async (req, res) => {
  try {
    const logs = await fs.readFile(LOG_FILE, 'utf8');
    const logEntries = logs.trim().split('\n')
      .map(line => JSON.parse(line))
      .slice(-50); // 50 אחרונים
    
    res.json({
      message: 'לוגים אחרונים',
      count: logEntries.length,
      logs: logEntries
    });
  } catch (err) {
    res.json({
      message: 'אין עדיין לוגים',
      logs: []
    });
  }
}));

// ===================================
// נתיבים למנהלים בלבד
// ===================================

app.delete('/users/:id', 
  authenticate, 
  requireRole('admin'), 
  (req, res) => {
    res.json({
      message: `משתמש ${req.params.id} נמחק`,
      deletedBy: req.user.name
    });
  }
);

app.get('/stats', 
  authenticate, 
  requireRole('admin', 'moderator'), 
  (req, res) => {
    res.json({
      message: 'סטטיסטיקות מערכת',
      rateLimitData: Object.keys(requestCounts).map(ip => ({
        ip,
        requests: requestCounts[ip].count,
        resetIn: Math.ceil((requestCounts[ip].resetTime - Date.now()) / 1000)
      })),
      serverUptime: process.uptime(),
      memory: process.memoryUsage()
    });
  }
);

// ===================================
// 404 Handler - עמוד לא נמצא
// ===================================

app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint לא נמצא',
    path: req.url,
    method: req.method,
    availableEndpoints: [
      'GET /',
      'GET /info',
      'GET /profile',
      'POST /users',
      'GET /logs',
      'DELETE /users/:id',
      'GET /stats'
    ]
  });
});

// ===================================
// Error Handler - טיפול בשגיאות
// ===================================

app.use((err, req, res, next) => {
  console.error('❌ שגיאה:', err);
  
  res.status(err.status || 500).json({
    error: 'שגיאה בשרת',
    message: err.message,
    timestamp: new Date().toISOString(),
    path: req.url
  });
});

// ===================================
// הפעלת השרת
// ===================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  🔧 Middleware Examples Server is running!           ║
║  📍 URL: http://localhost:${PORT}                         ║
╚════════════════════════════════════════════════════════╝

🎯 דוגמאות Middleware פעילות:
   ✅ Logger - תיעוד בקשות
   ✅ Request Timer - מדידת זמן
   ✅ Authentication - אימות משתמשים
   ✅ Role-based Auth - הרשאות
   ✅ Rate Limiter - הגבלת קצב (20/דקה)
   ✅ Validation - אימות נתונים
   ✅ File Logger - שמירה לקובץ
   ✅ Error Handler - טיפול בשגיאות

🔑 API Keys לדוגמה:
   key-123 → User
   key-456 → Admin
   key-789 → Moderator

📖 דוגמאות שימוש:

  # ציבורי
  curl http://localhost:${PORT}/

  # עם אימות
  curl http://localhost:${PORT}/profile -H "x-api-key: key-123"

  # יצירת משתמש
  curl -X POST http://localhost:${PORT}/users \\
    -H "Content-Type: application/json" \\
    -H "x-api-key: key-123" \\
    -d '{"name": "ישראל ישראלי", "email": "israel@example.com", "age": 30}'

  # רק למנהל
  curl -X DELETE http://localhost:${PORT}/users/1 \\
    -H "x-api-key: key-456"

  # בדיקת rate limiter (שלח 21 פעמים!)
  curl http://localhost:${PORT}/test-rate-limit

🎯 Try: http://localhost:${PORT}
  `);
});
