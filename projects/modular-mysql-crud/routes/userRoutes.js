// User Routes
// ניתוב משתמשים

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

// GET /api/users/stats - סטטיסטיקות (לפני /:id!)
router.get('/stats', getUserStats);

// GET /api/users - קבלת כל המשתמשים
router.get('/', getAllUsers);

// GET /api/users/:id - קבלת משתמש לפי ID
router.get('/:id', validateId, getUserById);

// POST /api/users - יצירת משתמש חדש
router.post('/', validateUser, createUser);

// PUT /api/users/:id - עדכון משתמש
router.put('/:id', validateId, validateUser, updateUser);

// DELETE /api/users/:id - מחיקת משתמש
router.delete('/:id', validateId, deleteUser);

export default router;
