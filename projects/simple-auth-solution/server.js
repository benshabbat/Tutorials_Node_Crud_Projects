import express from 'express';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Simple Auth API - Modular Solution',
    description: 'Authentication with username + password in each request',
    endpoints: {
      auth: {
        'POST /register': 'Register new user (no auth required)',
        'POST /login': 'Login to verify credentials (no auth required)',
        'GET /users': 'Get all users (no auth required)',
        'PUT /profile': 'Update profile (auth required)',
        'DELETE /account': 'Delete account (auth required)'
      },
      posts: {
        'GET /posts': 'Get all posts (no auth required)',
        'GET /posts/my': 'Get my posts (auth required)',
        'POST /posts': 'Create new post (auth required)',
        'PUT /posts/:id': 'Update post (auth required, owner only)',
        'DELETE /posts/:id': 'Delete post (auth required, owner only)'
      }
    },
    authentication: {
      method: 'Include username and password in request body',
      example: {
        username: 'john_doe',
        password: 'password123'
      }
    }
  });
});

app.use('/', authRoutes);
app.use('/posts', postRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Simple Auth API running on http://localhost:${PORT}`);
});
