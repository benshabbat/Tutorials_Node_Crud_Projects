import express from 'express';
import * as authController from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/custom-headers', authController.getCustomHeaders);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.post('/logout', authMiddleware, authController.logout);
router.get('/users', authMiddleware, authController.getUsers);
router.delete('/account', authMiddleware, authController.deleteAccount);

export default router;
