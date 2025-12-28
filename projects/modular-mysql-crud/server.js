// Main Server File
// Main server file

import express from 'express';
import userRoutes from './routes/userRoutes.js';
import { errorHandler, notFound, requestLogger } from './middleware/errorHandler.js';
import './config/db.js'; // Load database connection

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(requestLogger);

// Welcome Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Modular MySQL CRUD API',
    version: '1.0.0',
    database: 'MySQL',
    architecture: 'MVC (Model-View-Controller)',
    endpoints: {
      users: '/api/users',
      stats: '/api/users/stats'
    },
    documentation: {
      'GET /api/users': 'Get all users',
      'GET /api/users/:id': 'Get user by ID',
      'GET /api/users/stats': 'Database statistics',
      'POST /api/users': 'Create new user (body: name, email, age)',
      'PUT /api/users/:id': 'Update user',
      'DELETE /api/users/:id': 'Delete user'
    }
  });
});

// Routes
app.use('/api/users', userRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 Modular MySQL CRUD Server is running');
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📚 API: http://localhost:${PORT}/api/users`);
  console.log(`💾 Database: MySQL`);
  console.log(`🏗️  Architecture: MVC (Modular)`);
  console.log('='.repeat(50));
});
