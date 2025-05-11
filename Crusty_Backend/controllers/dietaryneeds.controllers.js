const db = require('../models');
const { DietaryNeeds, UserDietaryNeeds } = db;

// Get all dietary needs
exports.getAllDietaryNeeds = async (req, res) => {
  try {
    const dietaryNeeds = await DietaryNeeds.findAll({
      order: [['name', 'ASC']]
    });
    
    res.status(200).json(dietaryNeeds);
  } catch (error) {
    console.error('Error fetching dietary needs:', error);
    res.status(500).json({ message: 'Server error while fetching dietary needs' });
  }
};

// Get dietary need by ID
exports.getDietaryNeedById = async (req, res) => {
  try {
    const { needId } = req.params;
    
    const dietaryNeed = await DietaryNeeds.findByPk(needId);
    
    if (!dietaryNeed) {
      return res.status(404).json({ message: 'Dietary need not found' });
    }
    
    res.status(200).json(dietaryNeed);
  } catch (error) {
    console.error('Error fetching dietary need:', error);
    res.status(500).json({ message: 'Server error while fetching dietary need' });
  }
};

// Create new dietary need (admin only)
exports.createDietaryNeed = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    
    // Check if dietary need already exists
    const existingNeed = await DietaryNeeds.findOne({
      where: { name: name.trim() }
    });
    
    if (existingNeed) {
      return res.status(400).json({ message: 'Dietary need already exists' });
    }
    
    // Create dietary need
    const newDietaryNeed = await DietaryNeeds.create({
      name: name.trim()
    });
    
    res.status(201).json({
      message: 'Dietary need created successfully',
      dietaryNeed: newDietaryNeed
    });
  } catch (error) {
    console.error('Dietary need creation error:', error);
    res.status(500).json({ message: 'Server error while creating dietary need' });
  }
};

// Update dietary need (admin only)
exports.updateDietaryNeed = async (req, res) => {
  try {
    const { needId } = req.params;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    
    const dietaryNeed = await DietaryNeeds.findByPk(needId);
    
    if (!dietaryNeed) {
      return res.status(404).json({ message: 'Dietary need not found' });
    }
    
    // Check if new name already exists
    if (name.trim() !== dietaryNeed.name) {
      const existingNeed = await DietaryNeeds.findOne({
        where: { name: name.trim() }
      });
      
      if (existingNeed) {
        return res.status(400).json({ message: 'Dietary need with this name already exists' });
      }
    }
    
    // Update dietary need
    await dietaryNeed.update({
      name: name.trim()
    });
    
    res.status(200).json({
      message: 'Dietary need updated successfully',
      dietaryNeed
    });
  } catch (error) {
    console.error('Dietary need update error:', error);
    res.status(500).json({ message: 'Server error while updating dietary need' });
  }
};

// Delete dietary need (admin only)
exports.deleteDietaryNeed = async (req, res) => {
  try {
    const { needId } = req.params;
    
    const dietaryNeed = await DietaryNeeds.findByPk(needId);
    
    if (!dietaryNeed) {
      return res.status(404).json({ message: 'Dietary need not found' });
    }
    
    // Check if dietary need is being used by any users
    const usersWithNeed = await UserDietaryNeeds.count({
      where: { need_id: needId }
    });
    
    if (usersWithNeed > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete dietary need as it is associated with users',
        usersCount: usersWithNeed
      });
    }
    
    await dietaryNeed.destroy();
    
    res.status(200).json({ message: 'Dietary need deleted successfully' });
  } catch (error) {
    console.error('Dietary need deletion error:', error);
    res.status(500).json({ message: 'Server error while deleting dietary need' });
  }
};

// Get users with specific dietary need (admin only)
exports.getUsersWithDietaryNeed = async (req, res) => {
  try {
    const { needId } = req.params;
    
    const dietaryNeed = await DietaryNeeds.findByPk(needId, {
      include: [{
        model: UserDietaryNeeds,
        include: [{
          model: db.User,
          attributes: ['user_ID', 'username', 'email']
        }]
      }]
    });
    
    if (!dietaryNeed) {
      return res.status(404).json({ message: 'Dietary need not found' });
    }
    
    res.status(200).json({
      dietaryNeed: dietaryNeed.name,
      users: dietaryNeed.UserDietaryNeeds.map(udn => udn.User)
    });
  } catch (error) {
    console.error('Error fetching users with dietary need:', error);
    res.status(500).json({ message: 'Server error while fetching users with dietary need' });
  }
}; 