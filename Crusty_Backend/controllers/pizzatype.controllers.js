const db = require('../models');
const { PizzaType, PizzaPlace } = db;

// Get all pizza types
exports.getAllPizzaTypes = async (req, res) => {
  try {
    const pizzaTypes = await PizzaType.findAll({
      order: [['dough_type', 'ASC'], ['crust_type', 'ASC']]
    });
    
    res.status(200).json(pizzaTypes);
  } catch (error) {
    console.error('Error fetching pizza types:', error);
    res.status(500).json({ message: 'Server error while fetching pizza types' });
  }
};

// Get pizza type by ID
exports.getPizzaTypeById = async (req, res) => {
  try {
    const { typeId } = req.params;
    
    const pizzaType = await PizzaType.findByPk(typeId, {
      include: [{
        model: PizzaPlace,
        attributes: ['id', 'name', 'address'],
        through: { attributes: [] } // Exclude junction table attributes
      }]
    });
    
    if (!pizzaType) {
      return res.status(404).json({ message: 'Pizza type not found' });
    }
    
    res.status(200).json(pizzaType);
  } catch (error) {
    console.error('Error fetching pizza type:', error);
    res.status(500).json({ message: 'Server error while fetching pizza type' });
  }
};

// Create new pizza type
exports.createPizzaType = async (req, res) => {
  try {
    const { doughType, crustType } = req.body;
    
    if (!doughType || !crustType) {
      return res.status(400).json({ message: 'Both dough type and crust type are required' });
    }
    
    // Check if combination already exists
    const existingType = await PizzaType.findOne({
      where: {
        dough_type: doughType.trim(),
        crust_type: crustType.trim()
      }
    });
    
    if (existingType) {
      return res.status(400).json({ message: 'This pizza type combination already exists' });
    }
    
    const newPizzaType = await PizzaType.create({
      dough_type: doughType.trim(),
      crust_type: crustType.trim()
    });
    
    res.status(201).json({
      message: 'Pizza type created successfully',
      pizzaType: newPizzaType
    });
  } catch (error) {
    console.error('Pizza type creation error:', error);
    res.status(500).json({ message: 'Server error while creating pizza type' });
  }
};

// Update pizza type
exports.updatePizzaType = async (req, res) => {
  try {
    const { typeId } = req.params;
    const { doughType, crustType } = req.body;
    
    if (!doughType && !crustType) {
      return res.status(400).json({ message: 'At least one field (doughType or crustType) is required' });
    }
    
    const pizzaType = await PizzaType.findByPk(typeId);
    
    if (!pizzaType) {
      return res.status(404).json({ message: 'Pizza type not found' });
    }
    
    // Check if new combination would be duplicate
    if (doughType && crustType) {
      const existingType = await PizzaType.findOne({
        where: {
          dough_type: doughType.trim(),
          crust_type: crustType.trim(),
          type_id: { [db.Sequelize.Op.ne]: typeId }
        }
      });
      
      if (existingType) {
        return res.status(400).json({ message: 'This pizza type combination already exists' });
      }
    }
    
    await pizzaType.update({
      dough_type: doughType ? doughType.trim() : pizzaType.dough_type,
      crust_type: crustType ? crustType.trim() : pizzaType.crust_type
    });
    
    res.status(200).json({
      message: 'Pizza type updated successfully',
      pizzaType
    });
  } catch (error) {
    console.error('Pizza type update error:', error);
    res.status(500).json({ message: 'Server error while updating pizza type' });
  }
};

// Delete pizza type
exports.deletePizzaType = async (req, res) => {
  try {
    const { typeId } = req.params;
    
    const pizzaType = await PizzaType.findByPk(typeId, {
      include: [{
        model: PizzaPlace,
        attributes: ['id']
      }]
    });
    
    if (!pizzaType) {
      return res.status(404).json({ message: 'Pizza type not found' });
    }
    
    // Check if type is being used by any pizza places
    if (pizzaType.PizzaPlaces && pizzaType.PizzaPlaces.length > 0) {
      return res.status(400).json({
        message: 'Cannot delete pizza type as it is being used by pizza places',
        pizzaPlacesCount: pizzaType.PizzaPlaces.length
      });
    }
    
    await pizzaType.destroy();
    
    res.status(200).json({ message: 'Pizza type deleted successfully' });
  } catch (error) {
    console.error('Pizza type deletion error:', error);
    res.status(500).json({ message: 'Server error while deleting pizza type' });
  }
};
