import * as userModel from '../models/userModel.js';
import { extractTokenFromHeader } from '../services/authService.js';

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Unauthorized: Missing or invalid token format. Use "Bearer <token>"' 
      });
    }
    
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Unauthorized: No token provided' 
      });
    }
    
    const user = await userModel.getUserByToken(token);
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Unauthorized: Invalid token' 
      });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error authenticating user' });
  }
}
