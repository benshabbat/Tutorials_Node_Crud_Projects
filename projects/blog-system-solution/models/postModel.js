import fs from 'fs/promises';
import path from 'path';

const postsFilePath = path.join(process.cwd(), 'data', 'posts.json');

export async function getAllPosts() {
  try {
    const data = await fs.readFile(postsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function getPostById(id) {
  const posts = await getAllPosts();
  return posts.find(p => p.id === parseInt(id));
}

export async function getPostsByAuthor(authorId) {
  const posts = await getAllPosts();
  return posts.filter(p => p.authorId === parseInt(authorId));
}

export async function getPostsByTag(tag) {
  const posts = await getAllPosts();
  return posts.filter(p => p.tags && p.tags.includes(tag));
}

export async function searchPosts(query) {
  const posts = await getAllPosts();
  const lowerQuery = query.toLowerCase();
  return posts.filter(p => 
    p.title.toLowerCase().includes(lowerQuery) ||
    p.content.toLowerCase().includes(lowerQuery)
  );
}

export async function createPost(postData) {
  const posts = await getAllPosts();
  const maxId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) : 0;
  const newPost = {
    id: maxId + 1,
    ...postData,
    createdAt: new Date().toISOString()
  };
  posts.push(newPost);
  await savePosts(posts);
  return newPost;
}

export async function updatePost(id, postData) {
  const posts = await getAllPosts();
  const index = posts.findIndex(p => p.id === parseInt(id));
  
  if (index === -1) {
    return null;
  }
  
  const originalPost = posts[index];
  posts[index] = { 
    ...originalPost,
    ...postData,
    id: parseInt(id),
    createdAt: originalPost.createdAt
  };
  await savePosts(posts);
  return posts[index];
}

export async function deletePost(id) {
  const posts = await getAllPosts();
  const filteredPosts = posts.filter(p => p.id !== parseInt(id));
  
  if (filteredPosts.length === posts.length) {
    return false;
  }
  
  await savePosts(filteredPosts);
  return true;
}

async function savePosts(posts) {
  await fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2));
}
