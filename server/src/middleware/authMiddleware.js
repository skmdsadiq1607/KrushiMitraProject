import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// In-memory user store fallback for demo purposes if MongoDB is offline
export const demoUsers = new Map();

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please log in.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'crop_health_ai_college_jwt_secret_key_2025');

    // Check in MongoDB if connected
    try {
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
        return next();
      }
    } catch (e) {
      // MongoDB might be offline, fallback below
    }

    // Check in demo store
    if (demoUsers.has(decoded.id)) {
      req.user = demoUsers.get(decoded.id);
      return next();
    }

    // If demo token
    req.user = {
      _id: decoded.id,
      name: decoded.name || 'Demo Farmer',
      email: decoded.email || 'farmer@krushimitra.org',
      role: decoded.role || 'farmer'
    };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed or expired. Please re-login.'
    });
  }
};
