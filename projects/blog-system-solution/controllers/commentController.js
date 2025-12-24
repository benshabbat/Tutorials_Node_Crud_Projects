import * as commentModel from '../models/commentModel.js';
import * as postModel from '../models/postModel.js';
import * as userModel from '../models/userModel.js';

export async function getComments(req, res) {
  try {
    const comments = await commentModel.getAllComments();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments' });
  }
}

export async function getPostComments(req, res) {
  try {
    const post = await postModel.getPostById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const comments = await commentModel.getCommentsByPost(req.params.postId);
    // Sort by date (oldest first)
    const sortedComments = comments.sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );
    res.json(sortedComments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post comments' });
  }
}

export async function createComment(req, res) {
  try {
    const post = await postModel.getPostById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const author = await userModel.getUserById(req.body.authorId);
    if (!author) {
      return res.status(400).json({ message: 'Author not found' });
    }
    
    const commentData = {
      postId: parseInt(req.params.postId),
      authorId: req.body.authorId,
      content: req.body.content
    };
    
    const newComment = await commentModel.createComment(commentData);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment' });
  }
}

export async function deleteComment(req, res) {
  try {
    const comment = await commentModel.getCommentById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is the author (if currentUserId provided in body)
    if (req.body.currentUserId && comment.authorId !== parseInt(req.body.currentUserId)) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own comments' });
    }
    
    await commentModel.deleteComment(req.params.id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment' });
  }
}
