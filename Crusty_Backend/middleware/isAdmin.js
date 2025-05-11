const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.account_type === 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Error checking admin privileges' });
  }
}; 