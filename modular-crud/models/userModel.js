// User Model - Data layer
// Handles all data operations for users

// In-memory storage (in production, this would be a database)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35 }
];

let nextId = 4;

// Get all users
export const getAllUsers = () => {
  return users;
};

// Get user by ID
export const getUserById = (id) => {
  return users.find(user => user.id === parseInt(id));
};

// Create new user
export const createUser = (userData) => {
  const newUser = {
    id: nextId++,
    name: userData.name,
    email: userData.email,
    age: userData.age || null
  };
  
  users.push(newUser);
  return newUser;
};

// Update user
export const updateUser = (id, userData) => {
  const userIndex = users.findIndex(user => user.id === parseInt(id));
  
  if (userIndex === -1) {
    return null;
  }
  
  // Update only provided fields
  if (userData.name !== undefined) users[userIndex].name = userData.name;
  if (userData.email !== undefined) users[userIndex].email = userData.email;
  if (userData.age !== undefined) users[userIndex].age = userData.age;
  
  return users[userIndex];
};

// Delete user
export const deleteUser = (id) => {
  const userIndex = users.findIndex(user => user.id === parseInt(id));
  
  if (userIndex === -1) {
    return null;
  }
  
  const deletedUser = users[userIndex];
  users.splice(userIndex, 1);
  return deletedUser;
};

// Check if email exists (for validation)
export const emailExists = (email, excludeId = null) => {
  return users.some(user => 
    user.email === email && user.id !== excludeId
  );
};

// Get users count
export const getUsersCount = () => {
  return users.length;
};
