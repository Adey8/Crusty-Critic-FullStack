const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviews.controllers');
const auth = require('../middleware/auth');

// Public routes
router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getReviewById);
router.get('/pizza-place/:pizzaPlaceId', reviewController.getReviewsByPizzaPlace);

// Protected routes
router.post('/', auth, reviewController.createReview);
router.put('/:id', auth, reviewController.updateReview);
router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router; 