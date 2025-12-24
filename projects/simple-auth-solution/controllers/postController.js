import * as postModel from '../models/postModel.js';
import * as userModel from '../models/userModel.js';

export async function getPosts(req, res) {
  try {
    const posts = await postModel.getAllPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
}

export async function createPost(req, res) {
  try {
    const { username, password, title, content } = req.body;
    
    if (!username || !password) {
      return res.status(401).json({ message: 'Unauthorized: Username and password are required' });
    }
    
    const user = await userModel.validateUser(username, password);
    
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid username or password' });
    }
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    const postData = {
      title,
      content,
      authorId: user.id,
      authorUsername: user.username
    };
    
    const newPost = await postModel.createPost(postData);
    
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post' });
  }
}

export async function updatePost(req, res) {
  try {
    const { username, password, title, content } = req.body;
    
    if (!username || !password) {
      return res.status(401).json({ message: 'Unauthorized: Username and password are required' });
    }
    
    const user = await userModel.validateUser(username, password);
    
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid username or password' });
    }
    
    const post = await postModel.getPostById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (post.authorId !== user.id) {
      return res.status(403).json({ message: 'Forbidden: You can only modify your own posts' });
    }
    
    const updatedPost = await postModel.updatePost(req.params.id, { title, content });
    
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post' });
  }
}

export async function deletePost(req, res) {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(401).json({ message: 'Unauthorized: Username and password are required' });
    }
    
    const user = await userModel.validateUser(username, password);
    
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid username or password' });
    }
    
    const post = await postModel.getPostById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (post.authorId !== user.id) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own posts' });
    }
    
    await postModel.deletePost(req.params.id);
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post' });
  }
}

export async function getMyPosts(req, res) {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(401).json({ message: 'Unauthorized: Username and password are required' });
    }
    
    const user = await userModel.validateUser(username, password);
    
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid username or password' });
    }
    
    const posts = await postModel.getPostsByAuthor(user.id);
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
}
