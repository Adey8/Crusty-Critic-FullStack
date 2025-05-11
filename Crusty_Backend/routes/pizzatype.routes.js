const express = require('express');
const router = express.Router();
const pizzaTypeController = require('../controllers/pizzatype.controllers');
const auth = require('../middleware/auth');

// Public routes
router.get('/', pizzaTypeController.getAllPizzaTypes);
router.get('/:id', pizzaTypeController.getPizzaTypeById);

// Protected routes (require authentication)
router.post('/', auth, pizzaTypeController.createPizzaType);
router.put('/:id', auth, pizzaTypeController.updatePizzaType);
router.delete('/:id', auth, pizzaTypeController.deletePizzaType);

module.exports = router; 