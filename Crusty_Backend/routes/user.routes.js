const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');
const auth = require('../middleware/auth');

// Protected routes (require authentication)
router.get('/profile', auth, userController.getUserProfile);
router.put('/profile', auth, userController.updateProfile);
router.delete('/account', auth, userController.deleteAccount);
router.get('/reviews', auth, userController.getUserReviews);
router.get('/votes', auth, userController.getUserVotes);
router.get('/comments', auth, userController.getUserComments);

// Admin routes
router.get('/', auth, userController.getAllUsers);
router.get('/:id/admin', auth, userController.getUserById);
router.put('/:id/admin', auth, userController.updateUser);
router.delete('/:id/admin', auth, userController.deleteUser);
router.put('/:id/role', auth, userController.updateUserRole);
router.put('/:id/status', auth, userController.updateUserStatus);

// Public routes
router.get('/:id', userController.getUserById);

module.exports = router; 