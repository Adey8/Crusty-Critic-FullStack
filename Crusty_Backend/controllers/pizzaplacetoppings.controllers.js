const db = require('../models');
const { PizzaPlaceTopping, PizzaPlace, Topping } = db;

// Get all toppings for a pizza place
exports.getPizzaPlaceToppings = async (req, res) => {
  try {
    const { pizzaPlaceId } = req.params;
    
    const pizzaPlace = await PizzaPlace.findByPk(pizzaPlaceId);
    if (!pizzaPlace) {
      return res.status(404).json({ message: 'Pizza place not found' });
    }
    
    const toppings = await PizzaPlaceTopping.findAll({
      where: { pizza_place_id: pizzaPlaceId },
      include: [{
        model: Topping,
        attributes: ['topping_id', 'name', 'category']
      }],
      order: [[{ model: Topping }, 'name', 'ASC']]
    });
    
    res.status(200).json({
      pizzaPlace: {
        id: pizzaPlace.id,
        name: pizzaPlace.name
      },
      toppings: toppings.map(pt => pt.Topping)
    });
  } catch (error) {
    console.error('Error fetching pizza place toppings:', error);
    res.status(500).json({ message: 'Server error while fetching toppings' });
  }
};

// Get all pizza places offering a specific topping
exports.getPizzaPlacesWithTopping = async (req, res) => {
  try {
    const { toppingId } = req.params;
    
    const topping = await Topping.findByPk(toppingId);
    if (!topping) {
      return res.status(404).json({ message: 'Topping not found' });
    }
    
    const pizzaPlaces = await PizzaPlaceTopping.findAll({
      where: { topping_id: toppingId },
      include: [{
        model: PizzaPlace,
        attributes: ['id', 'name', 'address', 'average_rating']
      }],
      order: [[{ model: PizzaPlace }, 'name', 'ASC']]
    });
    
    res.status(200).json({
      topping: {
        id: topping.topping_id,
        name: topping.name
      },
      pizzaPlaces: pizzaPlaces.map(pt => pt.PizzaPlace)
    });
  } catch (error) {
    console.error('Error fetching pizza places with topping:', error);
    res.status(500).json({ message: 'Server error while fetching pizza places' });
  }
};

// Add toppings to a pizza place
exports.addToppingsToPizzaPlace = async (req, res) => {
  try {
    const { pizzaPlaceId } = req.params;
    const { toppingIds } = req.body;
    
    if (!Array.isArray(toppingIds) || toppingIds.length === 0) {
      return res.status(400).json({ message: 'Topping IDs array is required' });
    }
    
    // Check if pizza place exists
    const pizzaPlace = await PizzaPlace.findByPk(pizzaPlaceId);
    if (!pizzaPlace) {
      return res.status(404).json({ message: 'Pizza place not found' });
    }
    
    // Verify all toppings exist
    const toppings = await Topping.findAll({
      where: { topping_id: toppingIds }
    });
    
    if (toppings.length !== toppingIds.length) {
      return res.status(400).json({ message: 'One or more invalid topping IDs' });
    }
    
    // Create associations
    const associations = toppingIds.map(toppingId => ({
      pizza_place_id: pizzaPlaceId,
      topping_id: toppingId
    }));
    
    await PizzaPlaceTopping.bulkCreate(associations, {
      ignoreDuplicates: true
    });
    
    res.status(201).json({
      message: 'Toppings added successfully',
      pizzaPlaceId,
      addedToppings: toppings.map(t => ({ id: t.topping_id, name: t.name }))
    });
  } catch (error) {
    console.error('Error adding toppings to pizza place:', error);
    res.status(500).json({ message: 'Server error while adding toppings' });
  }
};

// Remove toppings from a pizza place
exports.removeToppingsFromPizzaPlace = async (req, res) => {
  try {
    const { pizzaPlaceId } = req.params;
    const { toppingIds } = req.body;
    
    if (!Array.isArray(toppingIds) || toppingIds.length === 0) {
      return res.status(400).json({ message: 'Topping IDs array is required' });
    }
    
    // Check if pizza place exists
    const pizzaPlace = await PizzaPlace.findByPk(pizzaPlaceId);
    if (!pizzaPlace) {
      return res.status(404).json({ message: 'Pizza place not found' });
    }
    
    // Remove associations
    await PizzaPlaceTopping.destroy({
      where: {
        pizza_place_id: pizzaPlaceId,
        topping_id: toppingIds
      }
    });
    
    res.status(200).json({
      message: 'Toppings removed successfully',
      pizzaPlaceId,
      removedToppingIds: toppingIds
    });
  } catch (error) {
    console.error('Error removing toppings from pizza place:', error);
    res.status(500).json({ message: 'Server error while removing toppings' });
  }
};

// Update all toppings for a pizza place
exports.updatePizzaPlaceToppings = async (req, res) => {
  try {
    const { pizzaPlaceId } = req.params;
    const { toppingIds } = req.body;
    
    if (!Array.isArray(toppingIds)) {
      return res.status(400).json({ message: 'Topping IDs array is required' });
    }
    
    // Check if pizza place exists
    const pizzaPlace = await PizzaPlace.findByPk(pizzaPlaceId);
    if (!pizzaPlace) {
      return res.status(404).json({ message: 'Pizza place not found' });
    }
    
    // Verify all toppings exist if any are provided
    if (toppingIds.length > 0) {
      const toppings = await Topping.findAll({
        where: { topping_id: toppingIds }
      });
      
      if (toppings.length !== toppingIds.length) {
        return res.status(400).json({ message: 'One or more invalid topping IDs' });
      }
    }
    
    // Transaction to ensure atomicity
    await db.sequelize.transaction(async (t) => {
      // Remove all existing toppings
      await PizzaPlaceTopping.destroy({
        where: { pizza_place_id: pizzaPlaceId },
        transaction: t
      });
      
      // Add new toppings if any
      if (toppingIds.length > 0) {
        const associations = toppingIds.map(toppingId => ({
          pizza_place_id: pizzaPlaceId,
          topping_id: toppingId
        }));
        
        await PizzaPlaceTopping.bulkCreate(associations, {
          transaction: t
        });
      }
    });
    
    res.status(200).json({
      message: 'Pizza place toppings updated successfully',
      pizzaPlaceId,
      toppingIds
    });
  } catch (error) {
    console.error('Error updating pizza place toppings:', error);
    res.status(500).json({ message: 'Server error while updating toppings' });
  }
};
