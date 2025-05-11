const db = require('../models');
const { Participate, Challenge, User } = db;

// Get all participants for a challenge
exports.getChallengeParticipants = async (req, res) => {
  try {
    const { challengeId } = req.params;
    
    const participants = await Participate.findAll({
      where: { challenge_id: challengeId },
      include: [{
        model: User,
        attributes: ['user_ID', 'username', 'profile_picture']
      }],
      order: [[{ model: User }, 'username', 'ASC']]
    });
    
    res.status(200).json(participants);
  } catch (error) {
    console.error('Error fetching challenge participants:', error);
    res.status(500).json({ message: 'Server error while fetching participants' });
  }
};

// Get all challenges for a user
exports.getUserChallenges = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const participations = await Participate.findAll({
      where: { user_id: userId },
      include: [{
        model: Challenge,
        attributes: ['challenge_id', 'challenge_name', 'description', 'start_date', 'end_date']
      }],
      order: [[{ model: Challenge }, 'start_date', 'DESC']]
    });
    
    res.status(200).json(participations);
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    res.status(500).json({ message: 'Server error while fetching challenges' });
  }
};

// Join a challenge
exports.joinChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.userId; // Assuming this is set by auth middleware
    
    // Check if challenge exists and is active
    const challenge = await Challenge.findByPk(challengeId);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    const currentDate = new Date();
    if (currentDate > challenge.end_date) {
      return res.status(400).json({ message: 'Challenge has already ended' });
    }
    
    // Check if user is already participating
    const existingParticipation = await Participate.findOne({
      where: {
        user_id: userId,
        challenge_id: challengeId
      }
    });
    
    if (existingParticipation) {
      return res.status(400).json({ message: 'User is already participating in this challenge' });
    }
    
    // Create participation
    const participation = await Participate.create({
      user_id: userId,
      challenge_id: challengeId
    });
    
    res.status(201).json({
      message: 'Successfully joined the challenge',
      participation
    });
  } catch (error) {
    console.error('Error joining challenge:', error);
    res.status(500).json({ message: 'Server error while joining challenge' });
  }
};

// Leave a challenge
exports.leaveChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.userId; // Assuming this is set by auth middleware
    
    const participation = await Participate.findOne({
      where: {
        user_id: userId,
        challenge_id: challengeId
      }
    });
    
    if (!participation) {
      return res.status(404).json({ message: 'User is not participating in this challenge' });
    }
    
    // Check if challenge has already ended
    const challenge = await Challenge.findByPk(challengeId);
    if (challenge && new Date() > challenge.end_date) {
      return res.status(400).json({ message: 'Cannot leave a challenge that has already ended' });
    }
    
    await participation.destroy();
    
    res.status(200).json({ message: 'Successfully left the challenge' });
  } catch (error) {
    console.error('Error leaving challenge:', error);
    res.status(500).json({ message: 'Server error while leaving challenge' });
  }
};

// Check if user is participating in a challenge
exports.checkParticipation = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.userId; // Assuming this is set by auth middleware
    
    const participation = await Participate.findOne({
      where: {
        user_id: userId,
        challenge_id: challengeId
      }
    });
    
    res.status(200).json({
      isParticipating: !!participation,
      participation: participation
    });
  } catch (error) {
    console.error('Error checking participation:', error);
    res.status(500).json({ message: 'Server error while checking participation' });
  }
};

// Get participation statistics
exports.getParticipationStats = async (req, res) => {
  try {
    const { challengeId } = req.params;
    
    const participantCount = await Participate.count({
      where: { challenge_id: challengeId }
    });
    
    const challenge = await Challenge.findByPk(challengeId, {
      attributes: ['challenge_name', 'start_date', 'end_date']
    });
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    res.status(200).json({
      challenge: challenge,
      totalParticipants: participantCount,
      isActive: new Date() >= challenge.start_date && new Date() <= challenge.end_date
    });
  } catch (error) {
    console.error('Error fetching participation stats:', error);
    res.status(500).json({ message: 'Server error while fetching participation stats' });
  }
};
