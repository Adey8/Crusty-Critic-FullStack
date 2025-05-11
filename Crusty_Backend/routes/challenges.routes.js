const express = require('express');
const router = express.Router();
const challengesController = require('../controllers/challenges.controllers');
const auth = require('../middleware/auth');

// Public routes
router.get('/', challengesController.getAllChallenges);
router.get('/active', challengesController.getActiveChallenges);
router.get('/:challengeId', challengesController.getChallengeById);
router.get('/:challengeId/participants', challengesController.getChallengeParticipants);

// Protected routes (require authentication)
router.post('/', auth, challengesController.createChallenge);
router.put('/:challengeId', auth, challengesController.updateChallenge);
router.delete('/:challengeId', auth, challengesController.deleteChallenge);

module.exports = router; 