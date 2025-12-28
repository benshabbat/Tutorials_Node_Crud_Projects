// User Routes
// User routing

import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} from '../controllers/userController.js';
import { validateUser, validateId } from '../middleware/validation.js';

const router = express.Router();

// GET /api/users/stats - Statistics (before /:id!)
router.get('/stats', getUserStats);

// GET /api/users - Get all users
router.get('/', getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', validateId, getUserById);

// POST /api/users - Create new user
router.post('/', validateUser, createUser);

// PUT /api/users/:id - Update user
router.put('/:id', validateId, validateUser, updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', validateId, deleteUser);

export default router;
