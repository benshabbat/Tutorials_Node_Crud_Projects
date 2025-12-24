import express from 'express';
import studentRoutes from './routes/studentRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Students & Courses API - Modular Solution',
    endpoints: {
      students: {
        'GET /students': 'Get all students',
        'GET /students/:id': 'Get student by ID',
        'GET /students/search?name=<name>': 'Search students by name',
        'POST /students': 'Create new student',
        'PUT /students/:id': 'Update student',
        'DELETE /students/:id': 'Delete student',
        'POST /students/:studentId/enroll/:courseId': 'Enroll student in course',
        'DELETE /students/:studentId/unenroll/:courseId': 'Unenroll student from course',
        'GET /students/:studentId/courses': 'Get all courses for student'
      },
      courses: {
        'GET /courses': 'Get all courses',
        'GET /courses/:id': 'Get course by ID',
        'GET /courses/search?instructor=<name>': 'Search courses by instructor',
        'GET /courses/search?minCredits=<n>&maxCredits=<n>': 'Search courses by credits range',
        'POST /courses': 'Create new course',
        'PUT /courses/:id': 'Update course',
        'DELETE /courses/:id': 'Delete course',
        'GET /courses/:courseId/students': 'Get all students in course'
      },
      stats: {
        'GET /stats': 'Get system statistics'
      }
    }
  });
});

app.use('/students', studentRoutes);
app.use('/courses', courseRoutes);
app.use('/stats', statsRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
