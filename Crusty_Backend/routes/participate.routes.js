const express = require('express');
const router = express.Router();
const participateController = require('../controllers/participate.controllers');
const auth = require('../middleware/auth');

// Public routes
router.get('/challenge/:challengeId', participateController.getChallengeParticipants);
router.get('/user/:userId', participateController.getUserChallenges);
router.get('/challenge/:challengeId/stats', participateController.getParticipationStats);

// Protected routes (require authentication)
router.post('/challenge/:challengeId/join', auth, participateController.joinChallenge);
router.delete('/challenge/:challengeId/leave', auth, participateController.leaveChallenge);
router.get('/challenge/:challengeId/check', auth, participateController.checkParticipation);

module.exports = router; 