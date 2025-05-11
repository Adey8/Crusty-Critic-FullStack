const express = require('express');
const router = express.Router();
const toppingController = require('../controllers/toppings.controllers');
const auth = require('../middleware/auth');

// Public routes
router.get('/', toppingController.getAllToppings);
router.get('/:id', toppingController.getToppingById);
router.get('/type/:type', toppingController.getToppingsByType);
router.get('/:id/pizzaplaces', toppingController.getPizzaPlacesWithTopping);

// Protected routes
router.post('/', auth, toppingController.createTopping);
router.put('/:id', auth, toppingController.updateTopping);
router.delete('/:id', auth, toppingController.deleteTopping);

module.exports = router; 