// controllers/userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User, Review, Vote, Comment, DietaryNeeds, UserDietaryNeeds, Participate, PizzaPlace, Poll, PollOption } = require('../models');

// Get public user profile by username
exports.getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({
      where: { username },
      attributes: ['user_id', 'username', 'profile_picture_url', 'date_joined'],
      include: [
        {
          model: Review,
          attributes: ['review_id', 'rating', 'comment', 'created_at'],
          include: [{
            model: PizzaPlace,
            attributes: ['name', 'address']
          }]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching public profile:', error);
    res.status(500).json({ message: 'Server error while fetching public profile' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Register new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

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
      password: hashedPassword
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Get current user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findByPk(userId, {
      attributes: ['user_id', 'username', 'email', 'profile_picture_url', 'account_type', 'date_joined']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error while fetching user profile' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, email, profile_picture_url } = req.body;
    
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({
      username: username || user.username,
      email: email || user.email,
      profile_picture_url: profile_picture_url || user.profile_picture_url
    });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Update user password
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await user.update({ password: hashedPassword });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Server error while updating password' });
  }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Server error while deleting account' });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['user_id', 'username', 'email', 'account_type', 'date_joined']
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

// Get user by ID (admin only)
exports.getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Error getting user' });
  }
};

// Update user (admin only)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, accountType } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({
      email: email || user.email,
      account_type: accountType || user.account_type
    });

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        accountType: user.account_type
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error while updating user' });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { accountType } = req.body;

    if (!accountType) {
      return res.status(400).json({ message: 'Account type is required' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ account_type: accountType });

    res.status(200).json({
      message: 'User role updated successfully',
      user: {
        id: user.user_id,
        username: user.username,
        accountType: user.account_type
      }
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error while updating user role' });
  }
};

// Update user status (admin only)
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'Active status must be a boolean' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ is_active: isActive });

    res.status(200).json({
      message: 'User status updated successfully',
      user: {
        id: user.user_id,
        username: user.username,
        isActive: user.is_active
      }
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Server error while updating user status' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error getting profile' });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { user_id: req.userId },
      attributes: ['review_id', 'user_id', 'pizza_place_id', 'rating', 'review_text', 'date_submitted', 'approval_status'],
      include: [
        {
          model: PizzaPlace,
          as: 'pizzaPlace',
          attributes: ['name', 'address']
        }
      ]
    });
    res.json(reviews);
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Error getting user reviews' });
  }
};

exports.getUserVotes = async (req, res) => {
  try {
    const votes = await Vote.findAll({
      where: { user_id: req.userId },
      attributes: ['user_id', 'poll_id', 'option_id', 'created_at', 'updated_at'],
      include: [
        {
          model: Poll,
          as: 'poll',
          attributes: ['title', 'description']
        },
        {
          model: PollOption,
          as: 'option',
          attributes: ['text']
        }
      ]
    });
    res.json(votes);
  } catch (error) {
    console.error('Get user votes error:', error);
    res.status(500).json({ message: 'Error getting user votes' });
  }
};

exports.getUserComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { user_id: req.userId },
      attributes: ['comment_id', 'user_id', 'poll_id', 'comment_text', 'created_at', 'updated_at'],
      include: [
        {
          model: Poll,
          as: 'poll',
          attributes: ['title', 'description']
        }
      ]
    });
    res.json(comments);
  } catch (error) {
    console.error('Get user comments error:', error);
    res.status(500).json({ message: 'Error getting user comments' });
  }
};
