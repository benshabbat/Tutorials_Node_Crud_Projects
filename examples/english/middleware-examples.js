// 🔧 Middleware Examples - Express
// Complete server with all types of Middleware

import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = 3000;

// Built-in Middleware
app.use(express.json());

// ===================================
// 1️⃣ Logger Middleware - Request Logging
// ===================================

const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip;
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  next();
};

// Apply to all requests
app.use(logger);

// ===================================
// 2️⃣ Request Timer - Response Time Measurement
// ===================================

const requestTimer = (req, res, next) => {
  req.startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    console.log(`⏱️  Request to ${req.url} took ${duration}ms`);
  });
  
  next();
};

app.use(requestTimer);

// ===================================
// 3️⃣ API Key Authentication
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
      error: 'Missing API Key',
      hint: 'Add header: x-api-key'
    });
  }
  
  const user = apiKeys[apiKey];
  
  if (!user) {
    return res.status(403).json({ 
      error: 'Invalid API Key' 
    });
  }
  
  // Save user details in request
  req.user = user;
  console.log(`✅ Authenticated user: ${user.name} (${user.role})`);
  next();
};

// ===================================
// 4️⃣ Role-based Authorization
// ===================================

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required' 
      });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: req.user.role
      });
    }
    
    next();
  };
};

// ===================================
// 5️⃣ Rate Limiter
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
    
    // Reset counter if time has passed
    if (now > requestCounts[ip].resetTime) {
      requestCounts[ip] = { count: 1, resetTime: now + windowMs };
      return next();
    }
    
    // Check if limit exceeded
    if (requestCounts[ip].count >= maxRequests) {
      const resetIn = Math.ceil((requestCounts[ip].resetTime - now) / 1000);
      return res.status(429).json({ 
        error: 'Too many requests',
        message: `Try again in ${resetIn} seconds`,
        limit: maxRequests,
        resetIn: resetIn
      });
    }
    
    requestCounts[ip].count++;
    next();
  };
};

// Apply to all endpoints
app.use(rateLimiter(20, 60000)); // 20 requests per minute

// ===================================
// 6️⃣ Validation Middleware - Data Validation
// ===================================

const validateUser = (req, res, next) => {
  const { name, email, age } = req.body;
  const errors = [];
  
  // Check name
  if (!name || name.trim().length < 2) {
    errors.push('Name must contain at least 2 characters');
  }
  
  // Check email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Invalid email');
  }
  
  // Check age (if provided)
  if (age !== undefined) {
    if (typeof age !== 'number' || age < 0 || age > 150) {
      errors.push('Age must be a number between 0 and 150');
    }
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Invalid data',
      details: errors
    });
  }
  
  next();
};

// ===================================
// 7️⃣ Async Wrapper - Wrapper for async functions
// ===================================

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ===================================
// 8️⃣ Request Logger to File
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
    console.error('❌ Error saving log:', err.message);
  }
  
  next();
});

// ===================================
// Home Page - API Information
// ===================================

app.get('/', (req, res) => {
  res.json({
    message: '🔧 Middleware Examples API',
    description: 'Practical examples of Middleware',
    endpoints: {
      public: {
        'GET /': 'Home page',
        'GET /info': 'Server information',
        'GET /test-rate-limit': 'Test rate limiter'
      },
      authenticated: {
        'GET /profile': 'User profile (requires API Key)',
        'POST /users': 'Create user (requires API Key)',
        'GET /logs': 'View logs (requires API Key)'
      },
      admin: {
        'DELETE /users/:id': 'Delete user (admin only)',
        'GET /stats': 'Statistics (admin/moderator)'
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
// Public Routes
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
    message: 'Request received!',
    tip: 'Try sending 21 requests in one minute - you\'ll get a 429 error'
  });
});

// ===================================
// Authenticated Routes
// ===================================

app.get('/profile', authenticate, (req, res) => {
  res.json({
    message: 'User profile',
    user: req.user
  });
});

// Create user - with authentication and validation
app.post('/users', authenticate, validateUser, (req, res) => {
  const newUser = {
    id: Date.now(),
    ...req.body,
    createdBy: req.user.name,
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json({
    message: 'User created successfully',
    user: newUser
  });
});

// View logs
app.get('/logs', authenticate, fileLogger, asyncHandler(async (req, res) => {
  try {
    const logs = await fs.readFile(LOG_FILE, 'utf8');
    const logEntries = logs.trim().split('\n')
      .map(line => JSON.parse(line))
      .slice(-50); // Last 50
    
    res.json({
      message: 'Recent logs',
      count: logEntries.length,
      logs: logEntries
    });
  } catch (err) {
    res.json({
      message: 'No logs yet',
      logs: []
    });
  }
}));

// ===================================
// Admin-only Routes
// ===================================

app.delete('/users/:id', 
  authenticate, 
  requireRole('admin'), 
  (req, res) => {
    res.json({
      message: `User ${req.params.id} deleted`,
      deletedBy: req.user.name
    });
  }
);

app.get('/stats', 
  authenticate, 
  requireRole('admin', 'moderator'), 
  (req, res) => {
    res.json({
      message: 'System statistics',
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
// 404 Handler - Page Not Found
// ===================================

app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
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
// Error Handler
// ===================================

app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  
  res.status(err.status || 500).json({
    error: 'Server error',
    message: err.message,
    timestamp: new Date().toISOString(),
    path: req.url
  });
});

// ===================================
// Start Server
// ===================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  🔧 Middleware Examples Server is running!           ║
║  📍 URL: http://localhost:${PORT}                         ║
╚════════════════════════════════════════════════════════╝

🎯 Active Middleware Examples:
   ✅ Logger - Request logging
   ✅ Request Timer - Time measurement
   ✅ Authentication - User authentication
   ✅ Role-based Auth - Permissions
   ✅ Rate Limiter - Rate limiting (20/min)
   ✅ Validation - Data validation
   ✅ File Logger - Save to file
   ✅ Error Handler - Error handling

🔑 Example API Keys:
   key-123 → User
   key-456 → Admin
   key-789 → Moderator

📖 Usage Examples:

  # Public
  curl http://localhost:${PORT}/

  # With authentication
  curl http://localhost:${PORT}/profile -H "x-api-key: key-123"

  # Create user
  curl -X POST http://localhost:${PORT}/users \\
    -H "Content-Type: application/json" \\
    -H "x-api-key: key-123" \\
    -d '{"name": "John Doe", "email": "john@example.com", "age": 30}'

  # Admin only
  curl -X DELETE http://localhost:${PORT}/users/1 \\
    -H "x-api-key: key-456"

  # Test rate limiter (send 21 times!)
  curl http://localhost:${PORT}/test-rate-limit

🎯 Try: http://localhost:${PORT}
  `);
});
