// User Controller - Business logic
// User controller - business logic

import User from '../models/userModel.js';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    console.error('Error getting users:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.getById(id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Error getting user:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// Create new user
export const createUser = async (req, res) => {
  const { name, email, age } = req.body;

  // Validation - handled in middleware
  try {
    const userId = await User.create({ name, email, age });
    const newUser = await User.getById(userId);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });
  } catch (err) {
    console.error('Error creating user:', err);

    // Handle duplicate email error
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success: false,
        error: 'Email already exists' 
      });
    }

    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// Update user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  // Validation - handled in middleware
  try {
    const updated = await User.update(id, { name, email, age });

    if (!updated) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    const updatedUser = await User.getById(id);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (err) {
    console.error('Error updating user:', err);

    // Handle duplicate email error
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success: false,
        error: 'Email already exists' 
      });
    }

    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Get user before deletion
    const user = await User.getById(id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    // Delete user
    await User.delete(id);

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: user
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// Statistics
export const getUserStats = async (req, res) => {
  try {
    const stats = await User.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    console.error('Error getting statistics:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};
