const express = require('express');
const router = express.Router();
const voteController = require('../controllers/vote.controllers');
const auth = require('../middleware/auth');

// Protected routes (require authentication)
router.post('/', auth, voteController.castVote);
router.get('/user', auth, voteController.getUserVotes);
router.get('/poll/:pollId', auth, voteController.getPollVotes);

// Admin only routes
router.delete('/:id', auth, voteController.deleteVote);

module.exports = router; 