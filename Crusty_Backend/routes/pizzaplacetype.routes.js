const express = require('express');
const router = express.Router();
const pizzaPlaceTypeController = require('../controllers/pizzaplacetype.controllers');
const auth = require('../middleware/auth');

// Public routes
router.get('/pizzaplace/:pizzaPlaceId', pizzaPlaceTypeController.getPizzaPlaceTypes);
router.get('/type/:typeId', pizzaPlaceTypeController.getPizzaPlacesWithType);

// Protected routes (require authentication)
router.post('/pizzaplace/:pizzaPlaceId', auth, pizzaPlaceTypeController.addTypesToPizzaPlace);
router.delete('/pizzaplace/:pizzaPlaceId', auth, pizzaPlaceTypeController.removeTypesFromPizzaPlace);
router.put('/pizzaplace/:pizzaPlaceId', auth, pizzaPlaceTypeController.updatePizzaPlaceTypes);

module.exports = router; 