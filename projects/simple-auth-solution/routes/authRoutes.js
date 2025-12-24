import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/users', authController.getUsers);
router.put('/profile', authController.updateProfile);
router.delete('/account', authController.deleteAccount);

export default router;
