# 🔧 Middleware Guide for Express Beginners

## 🤔 What is Middleware?

**Middleware** is a function that runs **between** receiving the request (Request) and sending the response (Response).

### Real-Life Analogy
Think about a security guard at an event venue entrance:
1. 👤 A person arrives (Request)
2. 🔍 The guard checks the invitation (Middleware)
3. ✅ If valid - lets them in (Next)
4. 🎉 The person reaches the party (Response)

---

## 📊 How Does Middleware Work?

```javascript
app.use((req, res, next) => {
  // Code that runs before every endpoint
  console.log('Request received!');
  next(); // Pass to the next function
});
```

**Execution Chain:**
```
Request → Middleware 1 → Middleware 2 → Route Handler → Response
```

---

## 🔑 Basic Structure

### A Middleware Function Receives 3 Parameters:

```javascript
function myMiddleware(req, res, next) {
  // req  - the request object
  // res  - the response object
  // next - function that passes to the next stage
  
  // Do something
  console.log('Middleware is running!');
  
  // Pass to the next stage
  next();
}
```

⚠️ **Important:** If you don't call `next()`, the request will get stuck and won't continue!

---

## 📝 Types of Middleware

### 1️⃣ Application-level Middleware
Runs on all requests in the application:

```javascript
// Runs on every request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Runs only on a specific path
app.use('/api', (req, res, next) => {
  console.log('API endpoint accessed');
  next();
});
```

### 2️⃣ Router-level Middleware
Runs on a specific Router:

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
Express's built-in middleware:

```javascript
// For reading JSON
app.use(express.json());

// For reading URL-encoded data
app.use(express.urlencoded({ extended: true }));

// For serving static files
app.use(express.static('public'));
```

### 4️⃣ Third-party Middleware
External packages:

```javascript
import cors from 'cors';
import morgan from 'morgan';

// CORS - access from different origins
app.use(cors());

// Morgan - advanced logging
app.use(morgan('dev'));
```

### 5️⃣ Error-handling Middleware
Error handling (4 parameters!):

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});
```

---

## 🎯 Practical Examples

### 1. Logger - Request Logging

```javascript
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

app.use(logger);
```

**Output:**
```
[2025-12-22T10:30:00.000Z] GET /users
[2025-12-22T10:30:05.000Z] POST /users
```

### 2. Authentication - User Authentication

```javascript
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API Key missing' });
  }
  
  if (apiKey !== 'secret-key-123') {
    return res.status(403).json({ error: 'Invalid API Key' });
  }
  
  // User is authenticated!
  next();
};

// Protect specific routes
app.get('/public', (req, res) => {
  res.send('Open to everyone');
});

app.get('/private', authenticate, (req, res) => {
  res.send('Only for authenticated users!');
});
```

### 3. Request Timer - Response Time Measurement

```javascript
const requestTimer = (req, res, next) => {
  req.startTime = Date.now();
  
  // Hook to end of response
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    console.log(`Request took ${duration}ms`);
  });
  
  next();
};

app.use(requestTimer);
```

### 4. Validation - Data Validation

```javascript
const validateUser = (req, res, next) => {
  const { name, email } = req.body;
  
  if (!name || name.length < 2) {
    return res.status(400).json({ error: 'Invalid name' });
  }
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  
  // Data is valid
  next();
};

app.post('/users', validateUser, (req, res) => {
  // Data is already validated here!
  res.json({ message: 'User created' });
});
```

### 5. Rate Limiting - Rate Limiting

```javascript
const requestCounts = {}; // In production: use Redis

const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  
  if (!requestCounts[ip]) {
    requestCounts[ip] = { count: 1, resetTime: now + 60000 }; // 1 minute
    return next();
  }
  
  if (now > requestCounts[ip].resetTime) {
    requestCounts[ip] = { count: 1, resetTime: now + 60000 };
    return next();
  }
  
  if (requestCounts[ip].count >= 10) {
    return res.status(429).json({ error: 'Too many requests. Try again in a minute' });
  }
  
  requestCounts[ip].count++;
  next();
};

app.use(rateLimiter);
```

---

## 🔄 Execution Order is Important!

```javascript
import express from 'express';
const app = express();

// 1. Most general - runs first
app.use((req, res, next) => {
  console.log('1: Global middleware');
  next();
});

// 2. Built-in middleware
app.use(express.json());

// 3. Path-specific middleware
app.use('/api', (req, res, next) => {
  console.log('2: API middleware');
  next();
});

// 4. Routes
app.get('/api/users', (req, res) => {
  console.log('3: Route handler');
  res.json({ message: 'Users' });
});

// 5. Error handler - runs last!
app.use((err, req, res, next) => {
  console.log('4: Error handler');
  res.status(500).json({ error: err.message });
});
```

**Output:**
```
1: Global middleware
2: API middleware
3: Route handler
```

---

## ⚡ Middleware with async/await

```javascript
// ❌ Wrong - errors not caught!
app.use(async (req, res, next) => {
  const data = await fetchData(); // If it fails, the server will crash!
  req.data = data;
  next();
});

// ✅ Correct - wrap in try/catch
app.use(async (req, res, next) => {
  try {
    const data = await fetchData();
    req.data = data;
    next();
  } catch (err) {
    next(err); // Pass the error to error handler
  }
});

// ✅ Even better - wrapper function
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

## 🎨 Useful Patterns

### Structure of Custom Middleware

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

// Usage
import { logger } from './middleware/logger.js';

app.use(logger({ format: 'detailed' }));
```

### Middleware with Configuration

```javascript
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role; // Assume there's a user object
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'No permission' });
    }
    
    next();
  };
};

// Usage
app.delete('/users/:id', 
  authenticate, 
  checkRole(['admin', 'moderator']), 
  (req, res) => {
    res.json({ message: 'User deleted' });
  }
);
```

---

## 🐛 Common Mistakes

### 1. Forgot to Call next()

```javascript
// ❌ Request will get stuck!
app.use((req, res, next) => {
  console.log('Log something');
  // Forgot next()!
});

// ✅ Correct
app.use((req, res, next) => {
  console.log('Log something');
  next(); // ✅
});
```

### 2. Calling next() After res.send()

```javascript
// ❌ Error: Cannot set headers after they are sent
app.use((req, res, next) => {
  res.send('Response');
  next(); // ❌ Trying to continue after we finished!
});

// ✅ Correct - either response or next
app.use((req, res, next) => {
  if (someCondition) {
    return res.send('Response'); // return prevents continuation
  }
  next(); // Only if we didn't send response
});
```

### 3. Wrong Order

```javascript
// ❌ Error handler before routes
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.get('/users', (req, res) => {
  res.json({ users: [] });
});

// ✅ Error handler always last!
app.get('/users', (req, res) => {
  res.json({ users: [] });
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
```

---

## 📦 Complete Example - Authentication System

```javascript
// middleware/auth.js
export const auth = {
  // Verify API Key
  verifyApiKey: (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(401).json({ 
        error: 'API Key is required',
        hint: 'Add x-api-key header'
      });
    }
    
    // Check against database (simple example)
    const validKeys = ['key-123', 'key-456'];
    
    if (!validKeys.includes(apiKey)) {
      return res.status(403).json({ 
        error: 'Invalid API Key' 
      });
    }
    
    // Save user information
    req.apiKeyUser = { id: 1, name: 'User' };
    next();
  },
  
  // Check permissions
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
  
  // Log access
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

// Public routes
app.get('/public', (req, res) => {
  res.json({ message: 'Public endpoint' });
});

// Protected routes
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

// Admin only
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

### 1. Keep Middleware in Separate Files
```
project/
├── middleware/
│   ├── auth.js
│   ├── logger.js
│   ├── validation.js
│   └── errorHandler.js
└── server.js
```

### 2. Use Clear Names
```javascript
// ❌ Not clear
const m1 = (req, res, next) => { ... };

// ✅ Clear
const authenticateUser = (req, res, next) => { ... };
```

### 3. Use async Wrapper
```javascript
// Utility function
export const asyncMiddleware = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

### 4. Add Documentation
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

### 5. Handle Errors
```javascript
// Always add error handler last
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

## 🎯 When to Use Middleware?

✅ **Yes:**
- Logging
- Authentication
- Authorization
- Data validation
- Rate limiting
- CORS
- Error handling
- Response compression

❌ **No:**
- Complex business logic (put in services)
- Operations specific to one route (put directly in route)
- Heavy computations that don't relate to the request

---

## 📚 Further Learning

1. **Examples:** [`examples/english/middleware-examples.js`](../../examples/english/middleware-examples.js)
2. **Exercises:** [`exercises/english/middleware-exercises.md`](../../exercises/english/middleware-exercises.md)
3. **Official Documentation:** [Express Middleware](https://expressjs.com/en/guide/using-middleware.html)

---

## 🎓 Summary

| Concept | Explanation | Example |
|---------|-------------|---------|
| `req` | The request object | `req.body`, `req.params` |
| `res` | The response object | `res.json()`, `res.send()` |
| `next()` | Pass to next stage | `next()` or `next(err)` |
| Application-level | Runs on entire application | `app.use(...)` |
| Router-level | Runs on specific router | `router.use(...)` |
| Error handler | 4 parameters | `(err, req, res, next)` |

---

**Now you know Middleware! 🎉**

Continue to:
- [Practical Examples](../../examples/english/middleware-examples.js)
- [Exercises](../../exercises/english/middleware-exercises.md)
- [Full Project](../../projects/)
