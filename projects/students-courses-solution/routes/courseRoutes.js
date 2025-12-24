import express from 'express';
import * as courseController from '../controllers/courseController.js';

const router = express.Router();

router.get('/', courseController.getCourses);
router.get('/search', courseController.searchCourses);
router.get('/:id', courseController.getCourseById);
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);
router.get('/:courseId/students', courseController.getCourseStudents);

export default router;
