const express = require('express');
const router = express.Router();
const dietaryNeedsController = require('../controllers/dietaryneeds.controllers');
const auth = require('../middleware/auth');

// Public routes
router.get('/', dietaryNeedsController.getAllDietaryNeeds);
router.get('/:needId', dietaryNeedsController.getDietaryNeedById);
router.get('/:needId/users', dietaryNeedsController.getUsersWithDietaryNeed);

// Protected routes (require authentication)
router.post('/', auth, dietaryNeedsController.createDietaryNeed);
router.put('/:needId', auth, dietaryNeedsController.updateDietaryNeed);
router.delete('/:needId', auth, dietaryNeedsController.deleteDietaryNeed);

module.exports = router; 