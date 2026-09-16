import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { demoUsers } from '../middleware/authMiddleware.js';

const generateToken = (id, name, email, role) => {
  return jwt.sign(
    { id, name, email, role },
    process.env.JWT_SECRET || 'crop_health_ai_college_jwt_secret_key_2025',
    { expiresIn: '30d' }
  );
};

// @desc   Register a new user
// @route  POST /api/auth/register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, farmLocation } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    try {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role: role || 'farmer',
        farmLocation: farmLocation || { state: 'Maharashtra', district: 'Pune' }
      });

      const token = generateToken(user._id, user.name, user.email, user.role);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          farmLocation: user.farmLocation
        }
      });
    } catch (dbErr) {
      // In-Memory Fallback if MongoDB is offline
      const mockId = 'demo-user-' + Date.now();
      const mockUser = {
        _id: mockId,
        name,
        email: email.toLowerCase(),
        role: role || 'farmer',
        farmLocation: farmLocation || { state: 'Maharashtra', district: 'Pune' }
      };
      demoUsers.set(mockId, mockUser);
      const token = generateToken(mockId, mockUser.name, mockUser.email, mockUser.role);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
          farmLocation: mockUser.farmLocation
        }
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc   Login user
// @route  POST /api/auth/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    // Check if it's the demo account
    if (email === 'demo@crophealth.ai' || email === 'farmer@krushimitra.org') {
      const demoId = 'demo-user-master';
      const demoUser = {
        _id: demoId,
        name: 'Ramesh Patel (Demo Farmer)',
        email: 'farmer@krushimitra.org',
        role: 'farmer',
        farmLocation: { state: 'Maharashtra', district: 'Pune' }
      };
      demoUsers.set(demoId, demoUser);
      const token = generateToken(demoId, demoUser.name, demoUser.email, demoUser.role);
      return res.json({
        success: true,
        token,
        user: demoUser
      });
    }

    try {
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. Password does not match.' });
      }

      const token = generateToken(user._id, user.name, user.email, user.role);

      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          farmLocation: user.farmLocation
        }
      });
    } catch (dbErr) {
      // In-Memory Fallback if MongoDB is offline: allow demo login
      const mockId = 'demo-user-offline';
      const mockUser = {
        _id: mockId,
        name: 'Agricultural Researcher',
        email: email.toLowerCase(),
        role: 'researcher',
        farmLocation: { state: 'Maharashtra', district: 'Pune' }
      };
      demoUsers.set(mockId, mockUser);
      const token = generateToken(mockId, mockUser.name, mockUser.email, mockUser.role);

      return res.json({
        success: true,
        token,
        user: mockUser
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc   Get current authenticated user profile
// @route  GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (err) {
    next(err);
  }
};
