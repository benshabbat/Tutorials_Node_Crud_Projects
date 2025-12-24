import express from 'express';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import * as commentController from './controllers/commentController.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Blog API - Full System with Modular Architecture',
    version: '1.0.0',
    endpoints: {
      users: {
        'GET /users': 'Get all users',
        'GET /users/:id': 'Get user by ID',
        'GET /users/:id/profile': 'Get user profile with stats',
        'GET /users/:id/posts': 'Get all posts by user',
        'POST /users': 'Create new user',
        'PUT /users/:id': 'Update user',
        'DELETE /users/:id': 'Delete user'
      },
      posts: {
        'GET /posts': 'Get all posts (sorted by date)',
        'GET /posts/:id': 'Get post by ID',
        'GET /posts/:id/full': 'Get full post with author and comments',
        'GET /posts/search?query=<text>': 'Search posts',
        'GET /posts/tag/:tagName': 'Get posts by tag',
        'POST /posts': 'Create new post',
        'PUT /posts/:id': 'Update post',
        'DELETE /posts/:id': 'Delete post and its comments',
        'GET /posts/:postId/comments': 'Get all comments for post',
        'POST /posts/:postId/comments': 'Add comment to post'
      },
      comments: {
        'GET /comments': 'Get all comments',
        'DELETE /comments/:id': 'Delete comment'
      },
      stats: {
        'GET /stats': 'Get system statistics'
      }
    }
  });
});

app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/stats', statsRoutes);

// Special route for post comments (nested)
app.get('/posts/:postId/comments', commentController.getPostComments);
app.post('/posts/:postId/comments', commentController.createComment);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Blog API running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
