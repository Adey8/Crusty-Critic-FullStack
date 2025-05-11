const { Op, fn, col, literal } = require('sequelize');
const { MapCoordinate, PizzaPlace } = require('../models');
const Deal = require('../models/deals.model');

// Get all pizza places with coordinates
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await MapCoordinate.findAll({
      include: [{
        model: PizzaPlace,
        attributes: ['name', 'average_rating', 'price_range'],
        include: [{
          model: Deal,
          where: {
            end_date: { [Op.gte]: new Date() }
          },
          required: false
        }]
      }]
    });

    res.status(200).json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ message: 'Server error while fetching locations' });
  }
};

// Get locations within bounds
exports.getLocationsInBounds = async (req, res) => {
  try {
    const { north, south, east, west } = req.query;

    const locations = await MapCoordinate.findAll({
      where: {
        latitude: { [Op.between]: [south, north] },
        longitude: { [Op.between]: [west, east] }
      },
      include: [{
        model: PizzaPlace,
        attributes: ['name', 'average_rating', 'price_range'],
        include: [{
          model: Deal,
          where: {
            end_date: { [Op.gte]: new Date() }
          },
          required: false
        }]
      }]
    });

    res.status(200).json(locations);
  } catch (error) {
    console.error('Error fetching locations in bounds:', error);
    res.status(500).json({ message: 'Server error while fetching locations' });
  }
};

// Get nearby locations
exports.getNearbyLocations = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query; // radius in kilometers

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const locations = await MapCoordinate.findAll({
      where: literal(`
        ST_DWithin(
          ST_MakePoint(longitude, latitude)::geography,
          ST_MakePoint(${longitude}, ${latitude})::geography,
          ${radius * 1000}
        )
      `),
      include: [{
        model: PizzaPlace,
        attributes: ['name', 'average_rating', 'price_range'],
        include: [{
          model: Deal,
          where: {
            end_date: { [Op.gte]: new Date() }
          },
          required: false
        }]
      }],
      order: literal(`
        ST_Distance(
          ST_MakePoint(longitude, latitude)::geography,
          ST_MakePoint(${longitude}, ${latitude})::geography
        )
      `)
    });

    res.status(200).json(locations);
  } catch (error) {
    console.error('Error fetching nearby locations:', error);
    res.status(500).json({ message: 'Server error while fetching nearby locations' });
  }
};

// Get locations with active deals
exports.getLocationsWithDeals = async (req, res) => {
  try {
    const locations = await MapCoordinate.findAll({
      include: [{
        model: PizzaPlace,
        attributes: ['name', 'average_rating', 'price_range'],
        include: [{
          model: Deal,
          where: {
            end_date: { [Op.gte]: new Date() }
          },
          required: true
        }]
      }]
    });

    res.status(200).json(locations);
  } catch (error) {
    console.error('Error fetching locations with deals:', error);
    res.status(500).json({ message: 'Server error while fetching locations with deals' });
  }
};

// Get location by ID
exports.getLocationById = async (req, res) => {
  try {
    const { locationId } = req.params;

    const location = await MapCoordinate.findByPk(locationId, {
      include: [{
        model: PizzaPlace,
        attributes: ['name', 'average_rating', 'price_range'],
        include: [{
          model: Deal,
          where: {
            end_date: { [Op.gte]: new Date() }
          },
          required: false
        }]
      }]
    });

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.status(200).json(location);
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ message: 'Server error while fetching location' });
  }
};

// Update location
exports.updateLocation = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { latitude, longitude, type } = req.body;

    const location = await MapCoordinate.findByPk(locationId);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    await location.update({
      latitude: latitude || location.latitude,
      longitude: longitude || location.longitude,
      type: type || location.type
    });

    res.status(200).json({
      message: 'Location updated successfully',
      location
    });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ message: 'Server error while updating location' });
  }
};

// Geocode address
exports.geocodeAddress = async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: 'Address is required' });
    }

    // Here you would typically use a geocoding service like Google Maps
    // For now, we'll return a mock response
    const mockCoordinates = {
      latitude: 40.7128,
      longitude: -74.0060
    };

    res.status(200).json(mockCoordinates);
  } catch (error) {
    console.error('Error geocoding address:', error);
    res.status(500).json({ message: 'Server error while geocoding address' });
  }
};

exports.getAllCoordinates = async (req, res) => {
  try {
    const coordinates = await MapCoordinate.findAll({
      include: [
        {
          model: PizzaPlace,
          attributes: ['name', 'address']
        }
      ]
    });
    res.json(coordinates);
  } catch (error) {
    console.error('Get all coordinates error:', error);
    res.status(500).json({ message: 'Error getting coordinates' });
  }
};

exports.getCoordinateById = async (req, res) => {
  try {
    const coordinate = await MapCoordinate.findByPk(req.params.id, {
      include: [
        {
          model: PizzaPlace,
          attributes: ['name', 'address']
        }
      ]
    });
    
    if (!coordinate) {
      return res.status(404).json({ message: 'Coordinate not found' });
    }

    res.json(coordinate);
  } catch (error) {
    console.error('Get coordinate by ID error:', error);
    res.status(500).json({ message: 'Error getting coordinate' });
  }
};

exports.getCoordinatesByPizzaPlace = async (req, res) => {
  try {
    const coordinates = await MapCoordinate.findAll({
      where: { pizza_place_id: req.params.pizzaPlaceId },
      include: [
        {
          model: PizzaPlace,
          attributes: ['name', 'address']
        }
      ]
    });
    res.json(coordinates);
  } catch (error) {
    console.error('Get coordinates by pizza place error:', error);
    res.status(500).json({ message: 'Error getting coordinates' });
  }
};

exports.createCoordinate = async (req, res) => {
  try {
    const { pizza_place_id, latitude, longitude, type } = req.body;
    
    // Validate input
    if (!pizza_place_id || !latitude || !longitude || !type) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const coordinate = await MapCoordinate.create({
      pizza_place_id,
      latitude,
      longitude,
      type
    });

    res.status(201).json(coordinate);
  } catch (error) {
    console.error('Create coordinate error:', error);
    res.status(500).json({ message: 'Error creating coordinate' });
  }
};

exports.updateCoordinate = async (req, res) => {
  try {
    const { latitude, longitude, type } = req.body;
    const coordinate = await MapCoordinate.findByPk(req.params.id);
    
    if (!coordinate) {
      return res.status(404).json({ message: 'Coordinate not found' });
    }

    await coordinate.update({
      latitude: latitude || coordinate.latitude,
      longitude: longitude || coordinate.longitude,
      type: type || coordinate.type
    });

    res.json(coordinate);
  } catch (error) {
    console.error('Update coordinate error:', error);
    res.status(500).json({ message: 'Error updating coordinate' });
  }
};

exports.deleteCoordinate = async (req, res) => {
  try {
    const coordinate = await MapCoordinate.findByPk(req.params.id);
    
    if (!coordinate) {
      return res.status(404).json({ message: 'Coordinate not found' });
    }

    await coordinate.destroy();
    res.json({ message: 'Coordinate deleted successfully' });
  } catch (error) {
    console.error('Delete coordinate error:', error);
    res.status(500).json({ message: 'Error deleting coordinate' });
  }
};
