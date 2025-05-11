const jwt = require('jsonwebtoken');
const db = require('../models');
const { User } = db;

// Verify JWT token and attach user to request
module.exports = async (req, res, next) => {
  try {
    // Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided or invalid format' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Decoded token:', decoded); // Debug log
    
    // Get userId from either userId or user_id field
    const userId = decoded.userId || decoded.user_id;
    
    if (!userId) {
      console.log('Token structure:', {
        hasUserId: !!decoded.userId,
        hasUserId2: !!decoded.user_id,
        decodedKeys: Object.keys(decoded)
      }); // Debug log
      return res.status(401).json({ message: 'Invalid token structure' });
    }

    // Find user in database
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user to request object
    req.user = user;
    req.userId = userId;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Internal server error during authentication' });
  }
};

// Check if user is admin
exports.isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if user is admin
    if (req.user.accountType !== 'admin') {
      return res.status(403).json({ message: 'Admin privileges required' });
    }
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Server error during admin check' });
  }
};

// Check if user is admin or owner of the pizza place
exports.isAdminOrOwner = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // If user is admin, allow access
    if (req.user.accountType === 'admin') {
      return next();
    }

    // Check if user is the owner of the pizza place
    const { pizzaPlaceId } = req.params;
    const pizzaPlace = await db.PizzaPlace.findByPk(pizzaPlaceId);

    if (!pizzaPlace) {
      return res.status(404).json({ message: 'Pizza place not found' });
    }

    if (pizzaPlace.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied: Not the owner of this pizza place' });
    }

    next();
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(500).json({ message: 'Server error during authorization check' });
  }
}; 