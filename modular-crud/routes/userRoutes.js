// User Routes - Routing layer
// Defines all endpoints and connects them to controllers

import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// GET /api/users - Get all users
router.get('/', userController.getUsers);

// GET /api/users/stats - Get user statistics
router.get('/stats', userController.getStats);

// GET /api/users/:id - Get single user
router.get('/:id', userController.getUser);

// POST /api/users - Create new user
router.post('/', userController.createUser);

// PUT /api/users/:id - Update user
router.put('/:id', userController.updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', userController.deleteUser);

export default router;
