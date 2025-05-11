const db = require('../models');
const { PizzaPlaceType, PizzaPlace, PizzaType } = db;

// Get all pizza types for a pizza place
exports.getPizzaPlaceTypes = async (req, res) => {
  try {
    const { pizzaPlaceId } = req.params;
    
    const pizzaPlace = await PizzaPlace.findByPk(pizzaPlaceId);
    if (!pizzaPlace) {
      return res.status(404).json({ message: 'Pizza place not found' });
    }
    
    const types = await PizzaPlaceType.findAll({
      where: { pizza_place_id: pizzaPlaceId },
      include: [{
        model: PizzaType,
        attributes: ['type_id', 'dough_type', 'crust_type']
      }],
      order: [[{ model: PizzaType }, 'dough_type', 'ASC']]
    });
    
    res.status(200).json({
      pizzaPlace: {
        id: pizzaPlace.id,
        name: pizzaPlace.name
      },
      types: types.map(pt => pt.PizzaType)
    });
  } catch (error) {
    console.error('Error fetching pizza place types:', error);
    res.status(500).json({ message: 'Server error while fetching types' });
  }
};

// Get all pizza places offering a specific type
exports.getPizzaPlacesWithType = async (req, res) => {
  try {
    const { typeId } = req.params;
    
    const pizzaType = await PizzaType.findByPk(typeId);
    if (!pizzaType) {
      return res.status(404).json({ message: 'Pizza type not found' });
    }
    
    const pizzaPlaces = await PizzaPlaceType.findAll({
      where: { type_id: typeId },
      include: [{
        model: PizzaPlace,
        attributes: ['id', 'name', 'address', 'average_rating']
      }],
      order: [[{ model: PizzaPlace }, 'name', 'ASC']]
    });
    
    res.status(200).json({
      pizzaType: {
        id: pizzaType.type_id,
        doughType: pizzaType.dough_type,
        crustType: pizzaType.crust_type
      },
      pizzaPlaces: pizzaPlaces.map(pt => pt.PizzaPlace)
    });
  } catch (error) {
    console.error('Error fetching pizza places with type:', error);
    res.status(500).json({ message: 'Server error while fetching pizza places' });
  }
};

// Add pizza types to a pizza place
exports.addTypesToPizzaPlace = async (req, res) => {
  try {
    const { pizzaPlaceId } = req.params;
    const { typeIds } = req.body;
    
    if (!Array.isArray(typeIds) || typeIds.length === 0) {
      return res.status(400).json({ message: 'Type IDs array is required' });
    }
    
    // Check if pizza place exists
    const pizzaPlace = await PizzaPlace.findByPk(pizzaPlaceId);
    if (!pizzaPlace) {
      return res.status(404).json({ message: 'Pizza place not found' });
    }
    
    // Verify all types exist
    const types = await PizzaType.findAll({
      where: { type_id: typeIds }
    });
    
    if (types.length !== typeIds.length) {
      return res.status(400).json({ message: 'One or more invalid type IDs' });
    }
    
    // Create associations
    const associations = typeIds.map(typeId => ({
      pizza_place_id: pizzaPlaceId,
      type_id: typeId
    }));
    
    await PizzaPlaceType.bulkCreate(associations, {
      ignoreDuplicates: true
    });
    
    res.status(201).json({
      message: 'Pizza types added successfully',
      pizzaPlaceId,
      addedTypes: types.map(t => ({
        id: t.type_id,
        doughType: t.dough_type,
        crustType: t.crust_type
      }))
    });
  } catch (error) {
    console.error('Error adding types to pizza place:', error);
    res.status(500).json({ message: 'Server error while adding types' });
  }
};

// Remove pizza types from a pizza place
exports.removeTypesFromPizzaPlace = async (req, res) => {
  try {
    const { pizzaPlaceId } = req.params;
    const { typeIds } = req.body;
    
    if (!Array.isArray(typeIds) || typeIds.length === 0) {
      return res.status(400).json({ message: 'Type IDs array is required' });
    }
    
    // Check if pizza place exists
    const pizzaPlace = await PizzaPlace.findByPk(pizzaPlaceId);
    if (!pizzaPlace) {
      return res.status(404).json({ message: 'Pizza place not found' });
    }
    
    // Remove associations
    await PizzaPlaceType.destroy({
      where: {
        pizza_place_id: pizzaPlaceId,
        type_id: typeIds
      }
    });
    
    res.status(200).json({
      message: 'Pizza types removed successfully',
      pizzaPlaceId,
      removedTypeIds: typeIds
    });
  } catch (error) {
    console.error('Error removing types from pizza place:', error);
    res.status(500).json({ message: 'Server error while removing types' });
  }
};

// Update all pizza types for a pizza place
exports.updatePizzaPlaceTypes = async (req, res) => {
  try {
    const { pizzaPlaceId } = req.params;
    const { typeIds } = req.body;
    
    if (!Array.isArray(typeIds)) {
      return res.status(400).json({ message: 'Type IDs array is required' });
    }
    
    // Check if pizza place exists
    const pizzaPlace = await PizzaPlace.findByPk(pizzaPlaceId);
    if (!pizzaPlace) {
      return res.status(404).json({ message: 'Pizza place not found' });
    }
    
    // Verify all types exist if any are provided
    if (typeIds.length > 0) {
      const types = await PizzaType.findAll({
        where: { type_id: typeIds }
      });
      
      if (types.length !== typeIds.length) {
        return res.status(400).json({ message: 'One or more invalid type IDs' });
      }
    }
    
    // Transaction to ensure atomicity
    await db.sequelize.transaction(async (t) => {
      // Remove all existing types
      await PizzaPlaceType.destroy({
        where: { pizza_place_id: pizzaPlaceId },
        transaction: t
      });
      
      // Add new types if any
      if (typeIds.length > 0) {
        const associations = typeIds.map(typeId => ({
          pizza_place_id: pizzaPlaceId,
          type_id: typeId
        }));
        
        await PizzaPlaceType.bulkCreate(associations, {
          transaction: t
        });
      }
    });
    
    res.status(200).json({
      message: 'Pizza place types updated successfully',
      pizzaPlaceId,
      typeIds
    });
  } catch (error) {
    console.error('Error updating pizza place types:', error);
    res.status(500).json({ message: 'Server error while updating types' });
  }
};
