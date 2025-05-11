const express = require('express');
const router = express.Router();
const pizzaPlacesController = require('../controllers/pizzaplaces.controllers');

// Public routes
router.get('/', pizzaPlacesController.getAllPizzaPlaces);
router.get('/search', pizzaPlacesController.searchPizzaPlaces);
router.get('/filter', pizzaPlacesController.filterPizzaPlaces);
router.get('/:pizzaPlaceId', pizzaPlacesController.getPizzaPlaceById);
router.get('/:pizzaPlaceId/reviews', pizzaPlacesController.getPizzaPlaceReviews);
router.get('/:pizzaPlaceId/deals', pizzaPlacesController.getPizzaPlaceDeals);

// Protected routes
router.post('/create', pizzaPlacesController.createPizzaPlace);

module.exports = router; 