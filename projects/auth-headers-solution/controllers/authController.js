import * as userModel from '../models/userModel.js';
import { generateToken } from '../services/authService.js';

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required' });
    }
    
    const token = generateToken();
    const newUser = await userModel.createUser({ username, email, password, token });
    
    if (newUser.error === 'username_exists') {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    if (newUser.error === 'email_exists') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // Don't return password
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      user: {
        id: userWithoutPassword.id,
        username: userWithoutPassword.username,
        email: userWithoutPassword.email
      },
      token: newUser.token
    });
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
    
    const users = await userModel.getAllUsers();
    const user = users.find(u => u.username === username);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    // Generate new token on login
    const newToken = generateToken();
    await userModel.updateUser(user.id, { token: newToken });
    
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token: newToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
}

export async function getProfile(req, res) {
  try {
    const { id, username, email } = req.user;
    res.json({ id, username, email });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
}

export async function updateProfile(req, res) {
  try {
    const { email, password } = req.body;
    
    const updateData = {};
    if (email) updateData.email = email;
    if (password) updateData.password = password;
    
    const updatedUser = await userModel.updateUser(req.user.id, updateData);
    
    const { password: _, token: __, ...userWithoutSensitive } = updatedUser;
    
    res.json(userWithoutSensitive);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
}

export async function logout(req, res) {
  try {
    await userModel.updateUser(req.user.id, { token: null });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging out' });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await userModel.getAllUsers();
    
    // Remove passwords and tokens
    const safeUsers = users.map(({ id, username, email }) => ({
      id,
      username,
      email
    }));
    
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
}

export async function deleteAccount(req, res) {
  try {
    await userModel.deleteUser(req.user.id);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting account' });
  }
}

export async function getCustomHeaders(req, res) {
  res.json({
    message: 'All headers received:',
    headers: req.headers
  });
}
