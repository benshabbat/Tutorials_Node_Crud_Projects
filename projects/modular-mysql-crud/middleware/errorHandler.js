// Error Handling Middleware
// Error handling middleware

// Request Logger
export const requestLogger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
};

// 404 Handler - when route not found
export const notFound = (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found',
    path: req.path 
  });
};

// Error Handler - general error handling
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // SQL error
  if (err.code && err.code.startsWith('ER_')) {
    return res.status(400).json({
      success: false,
      error: 'Database error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // General error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Server error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
