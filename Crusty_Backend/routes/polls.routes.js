const express = require('express');
const router = express.Router();
const pollController = require('../controllers/poll.controllers');
const auth = require('../middleware/auth');

// Public routes
router.get('/', pollController.getAllPolls);
router.get('/:id', pollController.getPollById);
router.get('/active', pollController.getActivePolls);

// Protected routes (require authentication)
router.post('/', auth, pollController.createPoll);
router.put('/:id', auth, pollController.updatePoll);
router.delete('/:id', auth, pollController.deletePoll);

module.exports = router; 