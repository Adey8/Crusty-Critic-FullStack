const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controllers');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Protected admin routes
router.get('/users', auth, isAdmin, adminController.getAllUsers);
router.get('/users/:id', auth, isAdmin, adminController.getUserById);
router.put('/users/:id', auth, isAdmin, adminController.updateUser);
router.delete('/users/:id', auth, isAdmin, adminController.deleteUser);

router.get('/polls', auth, isAdmin, adminController.getAllPolls);
router.get('/polls/:id', auth, isAdmin, adminController.getPollById);
router.delete('/polls/:id', auth, isAdmin, adminController.deletePoll);

router.get('/votes', auth, isAdmin, adminController.getAllVotes);
router.get('/votes/:id', auth, isAdmin, adminController.getVoteById);
router.delete('/votes/:id', auth, isAdmin, adminController.deleteVote);

router.get('/comments', auth, isAdmin, adminController.getAllComments);
router.get('/comments/:id', auth, isAdmin, adminController.getCommentById);
router.delete('/comments/:id', auth, isAdmin, adminController.deleteComment);

// Pizza place management
router.post('/pizza-places', adminController.createPizzaPlace);
router.put('/pizza-places/:pizzaPlaceId', adminController.updatePizzaPlace);
router.delete('/pizza-places/:pizzaPlaceId', adminController.deletePizzaPlace);

// Topping management
router.post('/toppings', adminController.createTopping);
router.put('/toppings/:toppingId', adminController.updateTopping);
router.delete('/toppings/:toppingId', adminController.deleteTopping);

// Review management
router.get('/reviews/pending', adminController.getPendingReviews);
router.put('/reviews/:reviewId/moderate', adminController.moderateReview);
router.get('/reviews/stats', adminController.getModerationStats);

// Challenge management
router.post('/challenges', adminController.createChallenge);

module.exports = router; 