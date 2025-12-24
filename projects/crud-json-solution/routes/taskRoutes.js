import express from 'express';
import * as taskController from '../controllers/taskController.js';

const router = express.Router();

router.get('/', taskController.getTasks);
router.get('/filter', taskController.filterTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.patch('/:id/toggle', taskController.toggleTask);
router.delete('/:id', taskController.deleteTask);

export default router;
