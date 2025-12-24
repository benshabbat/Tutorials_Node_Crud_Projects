import express from 'express';
import * as studentController from '../controllers/studentController.js';

const router = express.Router();

router.get('/', studentController.getStudents);
router.get('/search', studentController.searchStudents);
router.get('/:id', studentController.getStudentById);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);
router.post('/:studentId/enroll/:courseId', studentController.enrollStudent);
router.delete('/:studentId/unenroll/:courseId', studentController.unenrollStudent);
router.get('/:studentId/courses', studentController.getStudentCourses);

export default router;
