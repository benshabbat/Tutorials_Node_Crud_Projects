import express from 'express';
import * as postController from '../controllers/postController.js';

const router = express.Router();

router.get('/', postController.getPosts);
router.get('/search', postController.searchPosts);
router.get('/tag/:tagName', postController.getPostsByTag);
router.get('/:id', postController.getPostById);
router.get('/:id/full', postController.getFullPost);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

export default router;
