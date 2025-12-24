import * as userModel from '../models/userModel.js';
import * as postModel from '../models/postModel.js';
import * as commentModel from '../models/commentModel.js';

export async function getUsers(req, res) {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
}

export async function getUserById(req, res) {
  try {
    const user = await userModel.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
}

export async function createUser(req, res) {
  try {
    const newUser = await userModel.createUser(req.body);
    if (newUser.error === 'username_exists') {
      return res.status(400).json({ message: 'Username already exists' });
    }
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
}

export async function updateUser(req, res) {
  try {
    const updatedUser = await userModel.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
}

export async function deleteUser(req, res) {
  try {
    const userId = parseInt(req.params.id);
    
    // Check if user has posts or comments
    const posts = await postModel.getPostsByAuthor(userId);
    const allComments = await commentModel.getAllComments();
    const comments = allComments.filter(c => c.authorId === userId);
    
    if (posts.length > 0 || comments.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete user with existing posts or comments',
        postsCount: posts.length,
        commentsCount: comments.length
      });
    }
    
    const deleted = await userModel.deleteUser(userId);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
}

export async function getUserProfile(req, res) {
  try {
    const user = await userModel.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const posts = await postModel.getPostsByAuthor(req.params.id);
    const allComments = await commentModel.getAllComments();
    const comments = allComments.filter(c => c.authorId === parseInt(req.params.id));
    
    // Get recent posts (limit 5)
    const recentPosts = posts
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    
    res.json({
      user,
      stats: {
        postsCount: posts.length,
        commentsCount: comments.length
      },
      recentPosts
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
}

export async function getUserPosts(req, res) {
  try {
    const user = await userModel.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const posts = await postModel.getPostsByAuthor(req.params.id);
    const allComments = await commentModel.getAllComments();
    
    // Add comments count to each post
    const postsWithComments = posts.map(post => ({
      ...post,
      commentsCount: allComments.filter(c => c.postId === post.id).length
    }));
    
    res.json(postsWithComments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user posts' });
  }
}
