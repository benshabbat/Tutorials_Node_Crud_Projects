# 🎯 Exercises - Middleware

## 📋 Instructions

1. Create a new folder for each exercise
2. Install Express: `npm install express`
3. Add `"type": "module"` to package.json
4. Try to write the code yourself before looking at the solution
5. Test that everything works

---

## Exercise 1️⃣ - Basic Logger

### Task
Create middleware that logs every request received by the server.

### Requirements
- ✅ Display time, Method, and URL
- ✅ Run on all requests
- ✅ Different color for each method (optional)

### Example Output
```
[2025-12-22T10:30:00.000Z] GET /users
[2025-12-22T10:30:05.000Z] POST /users
[2025-12-22T10:30:10.000Z] DELETE /users/1
```

### Bonus
- Add colors: GET=green, POST=blue, DELETE=red
- Display the requester's IP as well
- Save logs to a file

<details>
<summary>💡 Hint</summary>

```javascript
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

app.use(logger);
```
</details>

---

## Exercise 2️⃣ - API Key Authentication

### Task
Create middleware that checks for an API Key in headers.

### Requirements
- ✅ Check if a header named `x-api-key` exists
- ✅ If not - return 401 with appropriate message
- ✅ If exists but incorrect - return 403
- ✅ If correct - continue to next endpoint

### Valid API Keys
```javascript
const validKeys = {
  'key-abc123': { id: 1, name: 'User One' },
  'key-xyz789': { id: 2, name: 'User Two' }
};
```

### Endpoints
```javascript
GET  /public       // no protection
GET  /private      // requires API Key
```

### Bonus
- Store user details in `req.user`
- Add a `/profile` endpoint that displays user details

<details>
<summary>💡 Hint</summary>

```javascript
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API Key missing' });
  }
  
  const user = validKeys[apiKey];
  if (!user) {
    return res.status(403).json({ error: 'Invalid API Key' });
  }
  
  req.user = user;
  next();
};
```
</details>

---

## Exercise 3️⃣ - Request Timer

### Task
Create middleware that measures how long each request takes.

### Requirements
- ✅ Save the request start time
- ✅ After the response is sent, display the elapsed time
- ✅ Display in milliseconds

### Example Output
```
⏱️  Request to /users took 45ms
⏱️  Request to /products took 120ms
```

### Bonus
- Add a warning if a request takes more than 1000ms
- Store statistics of average response times

<details>
<summary>💡 Hint</summary>

```javascript
const requestTimer = (req, res, next) => {
  req.startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    console.log(`⏱️  Request to ${req.url} took ${duration}ms`);
  });
  
  next();
};
```
</details>

---

## Exercise 4️⃣ - Validation Middleware

### Task
Create middleware that validates user data before creation.

### Requirements
- ✅ Check that there's a name (at least 2 characters)
- ✅ Check that there's a valid email (with @)
- ✅ Check that age is between 0 and 150 (if provided)
- ✅ Return 400 with list of errors if invalid

### Example Data
```json
{
  "name": "Israel",
  "email": "israel@example.com",
  "age": 30
}
```

### Bonus
- Add phone validation (Israeli format)
- Add check that email doesn't already exist
- Create separate middleware for each field

<details>
<summary>💡 Hint</summary>

```javascript
const validateUser = (req, res, next) => {
  const { name, email, age } = req.body;
  const errors = [];
  
  if (!name || name.length < 2) {
    errors.push('Invalid name');
  }
  
  if (!email || !email.includes('@')) {
    errors.push('Invalid email');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  
  next();
};
```
</details>

---

## Exercise 5️⃣ - Rate Limiter

### Task
Create middleware that limits the number of requests per minute.

### Requirements
- ✅ Allow maximum 5 requests per minute per IP
- ✅ If limit exceeded - return 429
- ✅ Display in response how long to wait

### Example Response
```json
{
  "error": "Too many requests",
  "retryAfter": 45
}
```

### Bonus
- Add `Retry-After` header to response
- Add statistics showing how many requests remain
- Allow different settings for different endpoints

<details>
<summary>💡 Hint</summary>

```javascript
const requestCounts = {};

const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const limit = 5;
  const window = 60000; // minute
  
  if (!requestCounts[ip]) {
    requestCounts[ip] = { count: 1, resetTime: now + window };
    return next();
  }
  
  if (now > requestCounts[ip].resetTime) {
    requestCounts[ip] = { count: 1, resetTime: now + window };
    return next();
  }
  
  if (requestCounts[ip].count >= limit) {
    return res.status(429).json({ 
      error: 'Too many requests' 
    });
  }
  
  requestCounts[ip].count++;
  next();
};
```
</details>

---

## Exercise 6️⃣ - Role-Based Authorization

### Task
Create middleware that checks permissions by role.

### Requirements
- ✅ Assume there's `req.user.role`
- ✅ Create middleware that receives a list of allowed roles
- ✅ If user is not authorized - return 403

### Roles
- `user` - regular user
- `moderator` - content manager
- `admin` - system administrator

### Usage Example
```javascript
app.delete('/users/:id', 
  authenticate,
  requireRole('admin'),
  deleteUserHandler
);

app.get('/stats',
  authenticate,
  requireRole('admin', 'moderator'),
  getStatsHandler
);
```

### Bonus
- Add detailed message about which role is required
- Create middleware for specific permissions

<details>
<summary>💡 Hint</summary>

```javascript
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Unauthorized',
        required: allowedRoles,
        current: req.user.role
      });
    }
    
    next();
  };
};
```
</details>

---

## Exercise 7️⃣ - Request Logger to File

### Task
Create middleware that saves logs to a file.

### Requirements
- ✅ Save every request to `logs/requests.log` file
- ✅ Save in JSON format
- ✅ Include: timestamp, method, url, ip
- ✅ Create the logs directory if it doesn't exist

### Log Format
```json
{"timestamp":"2025-12-22T10:30:00.000Z","method":"GET","url":"/users","ip":"::1"}
{"timestamp":"2025-12-22T10:30:05.000Z","method":"POST","url":"/users","ip":"::1"}
```

### Bonus
- Add rotation - new file every day
- Clean old logs (older than 7 days)
- Add `/logs` endpoint for viewing

<details>
<summary>💡 Hint</summary>

```javascript
import fs from 'fs/promises';

const fileLogger = async (req, res, next) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    ip: req.ip
  };
  
  try {
    await fs.mkdir('./logs', { recursive: true });
    await fs.appendFile('./logs/requests.log', JSON.stringify(logEntry) + '\n');
  } catch (err) {
    console.error('Error saving log:', err);
  }
  
  next();
};
```
</details>

---

## Exercise 8️⃣ - Error Handler Middleware

### Task
Create middleware for error handling.

### Requirements
- ✅ Catch any error that's thrown
- ✅ Display user-friendly message
- ✅ Log the full error to console
- ✅ Return 500 if no status code

### Response Format
```json
{
  "error": "Server error",
  "message": "Error message",
  "timestamp": "2025-12-22T10:30:00.000Z"
}
```

### Bonus
- Hide sensitive details in production
- Save errors to file
- Send email alert for critical errors

<details>
<summary>💡 Hint</summary>

```javascript
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  
  res.status(err.status || 500).json({
    error: 'Server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});
```
</details>

---

## Exercise 9️⃣ - Body Size Limiter

### Task
Create middleware that limits request body size.

### Requirements
- ✅ Limit to 1MB
- ✅ If larger - return 413 (Payload Too Large)
- ✅ Display the size sent and the maximum

### Example Response
```json
{
  "error": "Request too large",
  "size": "2.5 MB",
  "maxSize": "1 MB"
}
```

### Bonus
- Support different settings for different endpoints
- Count header size as well
- Add statistics of average sizes

---

## Exercise 🔟 - Mini Project: Blog API with Middleware

### Task
Build a complete blog API with all the Middleware you've learned.

### Requirements

#### Required Middleware
- ✅ Logger
- ✅ Authentication (API Key)
- ✅ Role-based Authorization
- ✅ Rate Limiter (10 requests/minute)
- ✅ Validation
- ✅ Error Handler

#### Endpoints

**Posts:**
```javascript
GET    /posts              // everyone - list of posts
GET    /posts/:id          // everyone - specific post
POST   /posts              // authenticated - create post
PUT    /posts/:id          // author/admin - update post
DELETE /posts/:id          // admin only - delete post
```

**Users:**
```javascript
GET    /users              // everyone - list of users
GET    /profile            // authenticated - my profile
PUT    /profile            // authenticated - update profile
DELETE /users/:id          // admin only - delete user
```

**Admin:**
```javascript
GET    /admin/stats        // admin only - statistics
GET    /admin/logs         // admin only - view logs
```

#### Models

**Post:**
```javascript
{
  id: 1,
  title: "Title",
  content: "Post content",
  author: "Author name",
  authorId: 1,
  createdAt: "2025-12-22T10:30:00.000Z",
  updatedAt: "2025-12-22T10:30:00.000Z"
}
```

**User:**
```javascript
{
  id: 1,
  name: "User",
  email: "user@example.com",
  role: "user", // user, moderator, admin
  apiKey: "key-123"
}
```

### Bonus
- Add comments to posts
- Add likes/views to posts
- Add search and pagination
- Store in files using fs/promises
- Add images to posts

---

## 📚 Tips

1. **Start simple** - one exercise at a time
2. **Test with tools** - Postman / Thunder Client / curl
3. **Print to console** - `console.log()` is your friend
4. **Read errors** - they tell you exactly what's wrong
5. **Experiment** - change values, break things, learn

## 🎯 Recommended Path

1. **Learn** → Read [`guides/english/middleware-guide.md`](../../guides/english/middleware-guide.md)
2. **See example** → Run [`examples/english/middleware-examples.js`](../../examples/english/middleware-examples.js)
3. **Practice** → Do exercises 1-8
4. **Build project** → Exercise 10 - Complete Blog API
5. **Improve** → Add your own features!

---

**Good luck! 💪🚀**
