import { readJSONFile, writeJSONFile, getNextId } from '../models/jsonDb.js';

const USERS_FILE = 'users.json';

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await readJSONFile(USERS_FILE);
        res.json({
            success: true,
            data: users,
            count: users.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const users = await readJSONFile(USERS_FILE);
        const user = users.find(u => u.id === parseInt(req.params.id));
        
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
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
};

// Create new user
export const createUser = async (req, res) => {
    try {
        const { name, email, age } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Name and email are required fields'
            });
        }
        
        const users = await readJSONFile(USERS_FILE);
        
        // Check if email already exists
        const emailExists = users.some(u => u.email === email);
        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists in the system'
            });
        }
        
        const newUser = {
            id: getNextId(users),
            name,
            email,
            age: age || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        users.push(newUser);
        await writeJSONFile(USERS_FILE, users);
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: newUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
};

// Update user
export const updateUser = async (req, res) => {
    try {
        const { name, email, age } = req.body;
        const userId = parseInt(req.params.id);
        
        const users = await readJSONFile(USERS_FILE);
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Check if email is being changed and if it already exists
        if (email && email !== users[userIndex].email) {
            const emailExists = users.some(u => u.email === email && u.id !== userId);
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists in the system'
                });
            }
        }
        
        users[userIndex] = {
            ...users[userIndex],
            name: name || users[userIndex].name,
            email: email || users[userIndex].email,
            age: age !== undefined ? age : users[userIndex].age,
            updatedAt: new Date().toISOString()
        };
        
        await writeJSONFile(USERS_FILE, users);
        
        res.json({
            success: true,
            message: 'User updated successfully',
            data: users[userIndex]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message
        });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const users = await readJSONFile(USERS_FILE);
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        users.splice(userIndex, 1);
        await writeJSONFile(USERS_FILE, users);
        
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
};
