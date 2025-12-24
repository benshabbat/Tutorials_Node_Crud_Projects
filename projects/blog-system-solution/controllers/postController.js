import * as postModel from '../models/postModel.js';
import * as userModel from '../models/userModel.js';
import * as commentModel from '../models/commentModel.js';

export async function getPosts(req, res) {
  try {
    const posts = await postModel.getAllPosts();
    // Sort by date (newest first)
    const sortedPosts = posts.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json(sortedPosts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
}

export async function getPostById(req, res) {
  try {
    const post = await postModel.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post' });
  }
}

export async function createPost(req, res) {
  try {
    // Verify author exists
    const author = await userModel.getUserById(req.body.authorId);
    if (!author) {
      return res.status(400).json({ message: 'Author not found' });
    }
    
    const newPost = await postModel.createPost(req.body);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post' });
  }
}

export async function updatePost(req, res) {
  try {
    const post = await postModel.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user is the author (if authorId provided in body)
    if (req.body.currentUserId && post.authorId !== parseInt(req.body.currentUserId)) {
      return res.status(403).json({ message: 'Forbidden: You can only update your own posts' });
    }
    
    const updatedPost = await postModel.updatePost(req.params.id, req.body);
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post' });
  }
}

export async function deletePost(req, res) {
  try {
    const post = await postModel.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Delete all comments for this post
    await commentModel.deleteCommentsByPost(req.params.id);
    
    const deleted = await postModel.deletePost(req.params.id);
    res.json({ message: 'Post and its comments deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post' });
  }
}

export async function searchPosts(req, res) {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }
    
    const posts = await postModel.searchPosts(query);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error searching posts' });
  }
}

export async function getPostsByTag(req, res) {
  try {
    const posts = await postModel.getPostsByTag(req.params.tagName);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts by tag' });
  }
}

export async function getFullPost(req, res) {
  try {
    const post = await postModel.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const author = await userModel.getUserById(post.authorId);
    const comments = await commentModel.getCommentsByPost(req.params.id);
    
    // Get comment authors
    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => {
        const commentAuthor = await userModel.getUserById(comment.authorId);
        return {
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          author: commentAuthor ? {
            id: commentAuthor.id,
            username: commentAuthor.username,
            name: commentAuthor.name
          } : null
        };
      })
    );
    
    res.json({
      post: {
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        tags: post.tags || []
      },
      author: author ? {
        id: author.id,
        username: author.username,
        name: author.name
      } : null,
      comments: commentsWithAuthors
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching full post' });
  }
}
