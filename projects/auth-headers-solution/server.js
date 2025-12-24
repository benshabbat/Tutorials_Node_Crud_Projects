import express from 'express';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Auth with Headers API - Modular Solution',
    description: 'Authentication with Bearer Tokens in Authorization Headers',
    endpoints: {
      public: {
        'POST /register': 'Register new user and get token',
        'POST /login': 'Login and get new token',
        'GET /custom-headers': 'Test headers (for learning)'
      },
      protected: {
        'GET /profile': 'Get user profile (requires token)',
        'PUT /profile': 'Update profile (requires token)',
        'POST /logout': 'Logout and invalidate token (requires token)',
        'GET /users': 'Get all users (requires token)',
        'DELETE /account': 'Delete account (requires token)'
      }
    },
    authentication: {
      method: 'Bearer Token in Authorization Header',
      header: 'Authorization: Bearer <your-token>',
      example: 'Authorization: Bearer a1b2c3d4e5f6g7h8i9j0'
    }
  });
});

app.use('/', authRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Auth Headers API running on http://localhost:${PORT}`);
});
