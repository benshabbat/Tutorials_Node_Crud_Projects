import express from 'express';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'CRUD JSON API - Modular Solution',
    endpoints: {
      users: {
        'GET /users': 'Get all users',
        'GET /users/:id': 'Get user by ID',
        'GET /users/search?city=<city>': 'Search users by city',
        'POST /users': 'Create new user',
        'PUT /users/:id': 'Update user',
        'DELETE /users/:id': 'Delete user'
      },
      tasks: {
        'GET /tasks': 'Get all tasks',
        'GET /tasks/:id': 'Get task by ID',
        'GET /tasks/filter?completed=true|false': 'Filter tasks by completion',
        'GET /tasks/filter?priority=high|medium|low': 'Filter tasks by priority',
        'POST /tasks': 'Create new task',
        'PUT /tasks/:id': 'Update task',
        'PATCH /tasks/:id/toggle': 'Toggle task completion',
        'DELETE /tasks/:id': 'Delete task'
      }
    }
  });
});

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
