const express = require('express');
const router = express.Router();
const pizzaPlaceToppingsController = require('../controllers/pizzaplacetoppings.controllers');
const auth = require('../middleware/auth');

// Public routes
router.get('/pizzaplace/:pizzaPlaceId', pizzaPlaceToppingsController.getPizzaPlaceToppings);
router.get('/topping/:toppingId', pizzaPlaceToppingsController.getPizzaPlacesWithTopping);

// Protected routes (require authentication)
router.post('/pizzaplace/:pizzaPlaceId', auth, pizzaPlaceToppingsController.addToppingsToPizzaPlace);
router.delete('/pizzaplace/:pizzaPlaceId', auth, pizzaPlaceToppingsController.removeToppingsFromPizzaPlace);
router.put('/pizzaplace/:pizzaPlaceId', auth, pizzaPlaceToppingsController.updatePizzaPlaceToppings);

module.exports = router; 