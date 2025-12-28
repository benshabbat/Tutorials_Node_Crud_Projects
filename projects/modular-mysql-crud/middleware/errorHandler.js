// Error Handling Middleware
// Middleware לטיפול בשגיאות

// Request Logger
export const requestLogger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
};

// 404 Handler - כשלא נמצא נתיב
export const notFound = (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'נתיב לא נמצא',
    path: req.path 
  });
};

// Error Handler - טיפול בשגיאות כלליות
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // שגיאת SQL
  if (err.code && err.code.startsWith('ER_')) {
    return res.status(400).json({
      success: false,
      error: 'שגיאה במסד הנתונים',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // שגיאה כללית
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'שגיאה בשרת',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
