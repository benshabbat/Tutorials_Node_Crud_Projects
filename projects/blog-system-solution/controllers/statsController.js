import * as userModel from '../models/userModel.js';
import * as postModel from '../models/postModel.js';
import * as commentModel from '../models/commentModel.js';

export async function getStats(req, res) {
  try {
    const users = await userModel.getAllUsers();
    const posts = await postModel.getAllPosts();
    const comments = await commentModel.getAllComments();
    
    // Find most active user (most posts)
    let mostActiveUser = null;
    let maxPosts = 0;
    
    for (const user of users) {
      const userPosts = posts.filter(p => p.authorId === user.id);
      if (userPosts.length > maxPosts) {
        maxPosts = userPosts.length;
        mostActiveUser = {
          id: user.id,
          username: user.username,
          name: user.name,
          postsCount: userPosts.length
        };
      }
    }
    
    // Find most popular post (most comments)
    let mostPopularPost = null;
    let maxComments = 0;
    
    for (const post of posts) {
      const postComments = comments.filter(c => c.postId === post.id);
      if (postComments.length > maxComments) {
        maxComments = postComments.length;
        mostPopularPost = {
          id: post.id,
          title: post.title,
          commentsCount: postComments.length
        };
      }
    }
    
    res.json({
      totalUsers: users.length,
      totalPosts: posts.length,
      totalComments: comments.length,
      mostActiveUser,
      mostPopularPost
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
}
