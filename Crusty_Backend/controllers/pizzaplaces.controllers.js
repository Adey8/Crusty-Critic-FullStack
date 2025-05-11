const { Op } = require('sequelize');
const {
  PizzaPlace,
  Review,
  MapCoordinate,
  PizzaPlaceTopping,
  Topping,
  PizzaPlaceType,
  PizzaType,
  Deal,
  User
} = require('../models');

// Get all pizza places
exports.getAllPizzaPlaces = async (req, res) => {
  try {
    const pizzaPlaces = await PizzaPlace.findAll({
      include: [
        {
          model: MapCoordinate,
          as: 'coordinates',
          attributes: ['latitude', 'longitude', 'type']
        }
      ]
    });
    
    res.status(200).json(pizzaPlaces);
  } catch (error) {
    console.error('Error fetching pizza places:', error);
    res.status(500).json({ message: 'Server error while fetching pizza places' });
  }
};

// Search pizza places
exports.searchPizzaPlaces = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const searchResults = await PizzaPlace.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { address: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } }
        ]
      },
      include: [
        {
          model: MapCoordinate,
          as: 'coordinates',
          attributes: ['latitude', 'longitude', 'type']
        }
      ],
      attributes: [
        'pizza_place_id', 'name', 'address', 'phone_number', 'description',
        'average_rating', 'website_url', 'hours_of_operation',
      ]
    });
    
    res.status(200).json(searchResults);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error during search' });
  }
};

// Get pizza place by ID
exports.getPizzaPlaceById = async (req, res) => {
  try {
    const { pizzaPlaceId } = req.params;
    
    const pizzaPlace = await PizzaPlace.findByPk(pizzaPlaceId, {
      include: [
        {
          model: MapCoordinate,
          as: 'coordinates',
          attributes: ['latitude', 'longitude', 'type']
        },
        {
          model: PizzaType,
          as: 'pizzaTypes',
          through: PizzaPlaceType
        },
        {
          model: Topping,
          as: 'toppings',
          through: PizzaPlaceTopping
        }
      ]
    });
    
    if (!pizzaPlace) {
      return res.status(404).json({ message: 'Pizza place not found' });
    }
    
    res.status(200).json(pizzaPlace);
  } catch (error) {
    console.error('Error fetching pizza place:', error);
    res.status(500).json({ message: 'Server error while fetching pizza place' });
  }
};

// Filter pizza places
exports.filterPizzaPlaces = async (req, res) => {
  try {
    const { minRating, maxPrice, hasDeals, pizzaType } = req.query;
    const where = {};
    
    if (minRating) {
      where.average_rating = { [Op.gte]: parseFloat(minRating) };
    }
    
    const pizzaPlaces = await PizzaPlace.findAll({
      where,
      include: [
        {
          model: MapCoordinate,
          as: 'coordinates',
          attributes: ['latitude', 'longitude', 'type']
        },
        {
          model: PizzaType,
          as: 'pizzaTypes',
          through: PizzaPlaceType,
          where: pizzaType ? { type_id: pizzaType } : undefined,
          required: !!pizzaType
        }
      ]
    });
    
    res.status(200).json(pizzaPlaces);
  } catch (error) {
    console.error('Error filtering pizza places:', error);
    res.status(500).json({ message: 'Server error while filtering pizza places' });
  }
};

// Get pizza place reviews
exports.getPizzaPlaceReviews = async (req, res) => {
  try {
    const { pizzaPlaceId } = req.params;
    
    const reviews = await Review.findAll({
      where: { pizza_place_id: pizzaPlaceId },
      include: [
        {
          model: User,
          attributes: ['username', 'profile_picture']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching pizza place reviews:', error);
    res.status(500).json({ message: 'Server error while fetching reviews' });
  }
};

// Get pizza place deals
exports.getPizzaPlaceDeals = async (req, res) => {
  try {
    const { pizzaPlaceId } = req.params;
    
    const deals = await Deal.findAll({
      where: { 
        pizza_place_id: pizzaPlaceId,
        expiration_date: { [Op.gt]: new Date() }
      },
      order: [['expiration_date', 'ASC']]
    });
    
    res.status(200).json(deals);
  } catch (error) {
    console.error('Error fetching pizza place deals:', error);
    res.status(500).json({ message: 'Server error while fetching deals' });
  }
};

// Create a new pizza place
exports.createPizzaPlace = async (req, res) => {
  try {
    const {
      name,
      address,
      phone_number,
      description,
      website_url,
      hours_of_operation,
      coordinates,
      pizza_types,
      toppings,
    } = req.body;

    // Validate required fields
    if (!name || !address) {
      return res.status(400).json({ message: 'Name and address are required' });
    }

    // Create the pizza place
    const pizzaPlace = await PizzaPlace.create({
      name,
      address,
      phone_number,
      description,
      website_url,
      hours_of_operation,
      average_rating: 0,
    });

    // Create coordinates if provided
    if (coordinates) {
      await MapCoordinate.create({
        pizza_place_id: pizzaPlace.pizza_place_id,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        type: coordinates.type || 'main',
      });
    }

    // Associate pizza types if provided (expects array of IDs)
    if (pizza_types && Array.isArray(pizza_types)) {
      await pizzaPlace.setPizzaTypes(pizza_types);
    }

    // Associate toppings if provided (expects array of IDs)
    if (toppings && Array.isArray(toppings)) {
      await pizzaPlace.setToppings(toppings);
    }

    // Fetch the complete pizza place with associations
    const completePizzaPlace = await PizzaPlace.findByPk(pizzaPlace.pizza_place_id, {
      include: [
        {
          model: MapCoordinate,
          as: 'coordinates',
          attributes: ['latitude', 'longitude', 'type'],
        },
        {
          model: PizzaType,
          as: 'pizzaTypes',
          through: PizzaPlaceType,
          attributes: ['type_id', 'dough_type', 'crust_type'],
        },
        {
          model: Topping,
          as: 'toppings',
          through: PizzaPlaceTopping,
        },
      ],
    });

    return res.status(201).json(completePizzaPlace);
  } catch (error) {
    console.error('Error creating pizza place:', error);
    return res.status(500).json({ message: 'Server error while creating pizza place' });
  }
};



