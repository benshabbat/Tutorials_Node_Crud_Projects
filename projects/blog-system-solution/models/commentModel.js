import fs from 'fs/promises';
import path from 'path';

const commentsFilePath = path.join(process.cwd(), 'data', 'comments.json');

export async function getAllComments() {
  try {
    const data = await fs.readFile(commentsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function getCommentById(id) {
  const comments = await getAllComments();
  return comments.find(c => c.id === parseInt(id));
}

export async function getCommentsByPost(postId) {
  const comments = await getAllComments();
  return comments.filter(c => c.postId === parseInt(postId));
}

export async function createComment(commentData) {
  const comments = await getAllComments();
  const maxId = comments.length > 0 ? Math.max(...comments.map(c => c.id)) : 0;
  const newComment = {
    id: maxId + 1,
    ...commentData,
    createdAt: new Date().toISOString()
  };
  comments.push(newComment);
  await saveComments(comments);
  return newComment;
}

export async function deleteComment(id) {
  const comments = await getAllComments();
  const filteredComments = comments.filter(c => c.id !== parseInt(id));
  
  if (filteredComments.length === comments.length) {
    return false;
  }
  
  await saveComments(filteredComments);
  return true;
}

export async function deleteCommentsByPost(postId) {
  const comments = await getAllComments();
  const filteredComments = comments.filter(c => c.postId !== parseInt(postId));
  await saveComments(filteredComments);
  return comments.length - filteredComments.length;
}

async function saveComments(comments) {
  await fs.writeFile(commentsFilePath, JSON.stringify(comments, null, 2));
}
