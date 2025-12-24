import fs from 'fs/promises';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

export async function getAllUsers() {
  try {
    const data = await fs.readFile(usersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function getUserById(id) {
  const users = await getAllUsers();
  return users.find(u => u.id === parseInt(id));
}

export async function getUserByUsername(username) {
  const users = await getAllUsers();
  return users.find(u => u.username === username);
}

export async function validateUser(username, password) {
  const users = await getAllUsers();
  const user = users.find(u => u.username === username && u.password === password);
  return user || null;
}

export async function createUser(userData) {
  const users = await getAllUsers();
  
  // Check if username exists
  if (users.some(u => u.username === userData.username)) {
    return { error: 'username_exists' };
  }
  
  const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
  const newUser = {
    id: maxId + 1,
    ...userData
  };
  users.push(newUser);
  await saveUsers(users);
  return newUser;
}

export async function updateUser(id, userData) {
  const users = await getAllUsers();
  const index = users.findIndex(u => u.id === parseInt(id));
  
  if (index === -1) {
    return null;
  }
  
  users[index] = { 
    id: parseInt(id),
    username: users[index].username,
    ...userData
  };
  await saveUsers(users);
  return users[index];
}

export async function deleteUser(id) {
  const users = await getAllUsers();
  const filteredUsers = users.filter(u => u.id !== parseInt(id));
  
  if (filteredUsers.length === users.length) {
    return false;
  }
  
  await saveUsers(filteredUsers);
  return true;
}

async function saveUsers(users) {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
}
