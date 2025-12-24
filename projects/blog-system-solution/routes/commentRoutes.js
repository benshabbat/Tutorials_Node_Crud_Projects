import express from 'express';
import * as commentController from '../controllers/commentController.js';

const router = express.Router();

router.get('/', commentController.getComments);
router.delete('/:id', commentController.deleteComment);

export default router;
