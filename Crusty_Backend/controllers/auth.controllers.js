const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate token
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  console.log('User object in generateToken:', {
    user_id: user.user_id,
    email: user.email,
    account_type: user.account_type
  });
  
  const tokenPayload = { 
    userId: user.user_id,
    email: user.email,
    accountType: user.account_type || 'user'
  };
  
  console.log('Token payload:', tokenPayload);
  
  return jwt.sign(
    tokenPayload,
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Helper function to format user response
const formatUserResponse = (user) => ({
  id: user.user_id,
  username: user.username,
  email: user.email,
  accountType: user.account_type || 'user'
});

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      account_type: 'user' // Changed from accountType to account_type
    });

    console.log('Created user:', user.toJSON());

    // Generate JWT token
    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatUserResponse(user)
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.message.includes('JWT_SECRET')) {
      return res.status(500).json({ message: 'Server configuration error' });
    }
    res.status(500).json({ message: 'Error registering user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Found user:', user.toJSON());

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: formatUserResponse(user)
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error.message.includes('JWT_SECRET')) {
      return res.status(500).json({ message: 'Server configuration error' });
    }
    res.status(500).json({ message: 'Error logging in' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'User ID not found in request' });
    }

    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(formatUserResponse(user));
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Error getting current user' });
  }
}; 