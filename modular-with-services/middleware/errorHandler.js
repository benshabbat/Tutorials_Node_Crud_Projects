// Middleware - Cross-cutting concerns

import { BusinessError } from '../services/productService.js';

// Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err);
  
  // Handle BusinessError from service layer
  if (err instanceof BusinessError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }
  
  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
  
  // Default error
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { 
      details: err.message,
      stack: err.stack 
    })
  });
};

// Not Found Middleware
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
};

// Request Logger Middleware
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  
  // Log request body for POST/PUT requests
  if ((req.method === 'POST' || req.method === 'PUT') && req.body) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  
  next();
};

// Request Timer Middleware (measure response time)
export const requestTimer = (req, res, next) => {
  const startTime = Date.now();
  
  // Intercept response finish
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`⏱️  Request completed in ${duration}ms - ${req.method} ${req.originalUrl}`);
  });
  
  next();
};

// CORS Middleware (for frontend integration)
export const corsMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
};

// Validate ID parameter middleware
export const validateIdParam = (req, res, next) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID parameter. Must be a positive number.'
    });
  }
  
  // Add parsed ID to request
  req.parsedId = id;
  next();
};

// Rate Limiting Middleware (simple in-memory)
const requestCounts = new Map();
const RATE_LIMIT = 100; // requests
const RATE_WINDOW = 60 * 1000; // 1 minute

export const rateLimiter = (req, res, next) => {
  const clientIp = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  // Get or initialize client data
  if (!requestCounts.has(clientIp)) {
    requestCounts.set(clientIp, { count: 1, resetTime: now + RATE_WINDOW });
    return next();
  }
  
  const clientData = requestCounts.get(clientIp);
  
  // Reset if window expired
  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + RATE_WINDOW;
    return next();
  }
  
  // Check limit
  if (clientData.count >= RATE_LIMIT) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
    });
  }
  
  // Increment count
  clientData.count++;
  next();
};

// Request sanitizer (basic XSS prevention)
export const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        // Remove potential HTML tags
        req.body[key] = req.body[key]
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      }
    });
  }
  next();
};
