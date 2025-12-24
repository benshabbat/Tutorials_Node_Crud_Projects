import * as userModel from '../models/userModel.js';

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required' });
    }
    
    const newUser = await userModel.createUser({ username, email, password });
    
    if (newUser.error === 'username_exists') {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    // Don't return password
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    const user = await userModel.validateUser(username, password);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await userModel.getAllUsers();
    
    // Remove passwords from response
    const safeUsers = users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
    
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
}

export async function updateProfile(req, res) {
  try {
    const { username, password, email, newPassword } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required for authentication' });
    }
    
    const user = await userModel.validateUser(username, password);
    
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid username or password' });
    }
    
    const updateData = {};
    if (email) updateData.email = email;
    if (newPassword) updateData.password = newPassword;
    else updateData.password = password; // Keep old password if no new one provided
    
    const updatedUser = await userModel.updateUser(user.id, updateData);
    
    const { password: _, ...userWithoutPassword } = updatedUser;
    
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
}

export async function deleteAccount(req, res) {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    const user = await userModel.validateUser(username, password);
    
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid username or password' });
    }
    
    // Delete user's posts first
    const { deletePostsByAuthor } = await import('../models/postModel.js');
    await deletePostsByAuthor(user.id);
    
    await userModel.deleteUser(user.id);
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting account' });
  }
}
