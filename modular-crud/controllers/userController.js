// User Controller - Business logic layer
// Handles request/response logic and validation

import * as UserModel from '../models/userModel.js';

// Get all users
export const getUsers = (req, res, next) => {
  try {
    const users = UserModel.getAllUsers();
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// Get single user
export const getUser = (req, res, next) => {
  try {
    const user = UserModel.getUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Create new user
export const createUser = (req, res, next) => {
  try {
    const { name, email, age } = req.body;
    
    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and email'
      });
    }
    
    // Check if email already exists
    if (UserModel.emailExists(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    // Validate age if provided
    if (age && (isNaN(age) || age < 0 || age > 150)) {
      return res.status(400).json({
        success: false,
        message: 'Age must be a number between 0 and 150'
      });
    }
    
    const newUser = UserModel.createUser({ name, email, age });
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    next(error);
  }
};

// Update user
export const updateUser = (req, res, next) => {
  try {
    const { name, email, age } = req.body;
    const userId = parseInt(req.params.id);
    
    // Check if user exists
    const existingUser = UserModel.getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }
      
      // Check if email already exists for another user
      if (UserModel.emailExists(email, userId)) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }
    
    // Validate age if provided
    if (age !== undefined && (isNaN(age) || age < 0 || age > 150)) {
      return res.status(400).json({
        success: false,
        message: 'Age must be a number between 0 and 150'
      });
    }
    
    const updatedUser = UserModel.updateUser(userId, { name, email, age });
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// Delete user
export const deleteUser = (req, res, next) => {
  try {
    const deletedUser = UserModel.deleteUser(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser
    });
  } catch (error) {
    next(error);
  }
};

// Get statistics
export const getStats = (req, res, next) => {
  try {
    const users = UserModel.getAllUsers();
    const totalUsers = UserModel.getUsersCount();
    
    // Calculate average age
    const usersWithAge = users.filter(u => u.age !== null);
    const averageAge = usersWithAge.length > 0
      ? (usersWithAge.reduce((sum, u) => sum + u.age, 0) / usersWithAge.length).toFixed(1)
      : 0;
    
    res.json({
      success: true,
      data: {
        totalUsers,
        usersWithAge: usersWithAge.length,
        averageAge: parseFloat(averageAge)
      }
    });
  } catch (error) {
    next(error);
  }
};
