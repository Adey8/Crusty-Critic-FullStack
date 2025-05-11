const express = require('express');
const router = express.Router();
const dealController = require('../controllers/deals.controllers');
const auth = require('../middleware/auth');

// Public routes
router.get('/', dealController.getAllDeals);
router.get('/:id', dealController.getDealById);
router.get('/pizza-place/:pizzaPlaceId', dealController.getDealsByPizzaPlace);

// Protected routes
router.post('/', auth, dealController.createDeal);
router.put('/:id', auth, dealController.updateDeal);
router.delete('/:id', auth, dealController.deleteDeal);

module.exports = router; 