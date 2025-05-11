const db = require('../models');
const { Challenge, Participate, Poll } = db;
const { Op } = require('sequelize');

// Get all challenges
exports.getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.findAll({
      include: [{
        model: Poll,
        as: 'poll',
        attributes: ['poll_id', 'title', 'description', 'options']
      }],
      order: [['start_date', 'DESC']]
    });
    
    res.status(200).json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ message: 'Server error while fetching challenges' });
  }
};

// Get challenge by ID
exports.getChallengeById = async (req, res) => {
  try {
    const { challengeId } = req.params;
    
    const challenge = await Challenge.findByPk(challengeId, {
      include: [{
        model: Poll,
        as: 'poll',
        attributes: ['poll_id', 'title', 'description', 'options']
      }]
    });
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    res.status(200).json(challenge);
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({ message: 'Server error while fetching challenge' });
  }
};

// Create new challenge
exports.createChallenge = async (req, res) => {
  try {
    const { challengeName, description, startDate, endDate } = req.body;
    
    // Validate input
    if (!challengeName || !description || !startDate || !endDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }
    
    // Create challenge
    const newChallenge = await Challenge.create({
      challenge_name: challengeName,
      description,
      start_date: start,
      end_date: end
    });
    
    res.status(201).json({
      message: 'Challenge created successfully',
      challenge: newChallenge
    });
  } catch (error) {
    console.error('Challenge creation error:', error);
    res.status(500).json({ message: 'Server error while creating challenge' });
  }
};

// Update challenge
exports.updateChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { challengeName, description, startDate, endDate } = req.body;
    
    const challenge = await Challenge.findByPk(challengeId);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    // Validate dates if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end <= start) {
        return res.status(400).json({ message: 'End date must be after start date' });
      }
    }
    
    // Update challenge
    await challenge.update({
      challenge_name: challengeName || challenge.challenge_name,
      description: description || challenge.description,
      start_date: startDate ? new Date(startDate) : challenge.start_date,
      end_date: endDate ? new Date(endDate) : challenge.end_date
    });
    
    res.status(200).json({
      message: 'Challenge updated successfully',
      challenge
    });
  } catch (error) {
    console.error('Challenge update error:', error);
    res.status(500).json({ message: 'Server error while updating challenge' });
  }
};

// Delete challenge
exports.deleteChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    
    const challenge = await Challenge.findByPk(challengeId);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    await challenge.destroy();
    
    res.status(200).json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    console.error('Challenge deletion error:', error);
    res.status(500).json({ message: 'Server error while deleting challenge' });
  }
};

// Get active challenges
exports.getActiveChallenges = async (req, res) => {
  try {
    const currentDate = new Date();
    
    const activeChallenges = await Challenge.findAll({
      where: {
        start_date: { [Op.lte]: currentDate },
        end_date: { [Op.gte]: currentDate }
      },
      include: [{
        model: Poll,
        as: 'poll',
        attributes: ['poll_id', 'title', 'description', 'options']
      }],
      order: [['end_date', 'ASC']]
    });
    
    res.status(200).json(activeChallenges);
  } catch (error) {
    console.error('Error fetching active challenges:', error);
    res.status(500).json({ message: 'Server error while fetching active challenges' });
  }
};

// Get challenge participants
exports.getChallengeParticipants = async (req, res) => {
  try {
    const { challengeId } = req.params;
    
    const challenge = await Challenge.findByPk(challengeId, {
      include: [{
        model: Participate,
        as: 'participants',
        include: [{
          model: db.User,
          attributes: ['username', 'profile_picture_url']
        }]
      }]
    });
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    res.status(200).json(challenge.participants);
  } catch (error) {
    console.error('Error fetching challenge participants:', error);
    res.status(500).json({ message: 'Server error while fetching challenge participants' });
  }
};
