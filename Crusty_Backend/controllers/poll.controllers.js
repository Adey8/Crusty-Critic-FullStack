const { Poll, PollOption, Vote, User, sequelize, Challenge } = require('../models');
const { Op } = require('sequelize');

exports.getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username']
        }
      ]
    });
    res.json(polls);
  } catch (error) {
    console.error('Get all polls error:', error);
    res.status(500).json({ message: 'Error getting polls' });
  }
};

exports.getPollById = async (req, res) => {
  try {
    const poll = await Poll.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username']
        }
      ]
    });
    
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    res.json(poll);
  } catch (error) {
    console.error('Get poll by ID error:', error);
    res.status(500).json({ message: 'Error getting poll' });
  }
};

exports.getActivePolls = async (req, res) => {
  try {
    const currentDate = new Date();
    const polls = await Poll.findAll({
      where: {
        start_date: { [Op.lte]: currentDate },
        end_date: { [Op.gte]: currentDate }
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username']
        }
      ]
    });
    res.json(polls);
  } catch (error) {
    console.error('Get active polls error:', error);
    res.status(500).json({ message: 'Error getting active polls' });
  }
};

exports.createPoll = async (req, res) => {
  try {
    console.log('Starting createPoll function');
    console.log('Available models:', Object.keys(sequelize.models));
    
    const { title, description, options, challenge_id, question } = req.body;
    console.log('Request body:', req.body);
    console.log('User from request:', req.user);
    
    // Validate input
    if (!title || !options || !Array.isArray(options) || options.length < 2 || !question) {
      return res.status(400).json({ message: 'title, question, and at least 2 options are required' });
    }

    // Validate challenge_id exists
    if (!challenge_id) {
      return res.status(400).json({ message: 'Challenge ID is required' });
    }

    // Validate user is authenticated
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ message: 'User must be authenticated' });
    }

    console.log('Creating poll with data:', {
      title,
      description,
      options,
      challenge_id,
      user_id: req.user.user_id,
      question
    });

    try {
      // First check if the challenge exists
      const challenge = await Challenge.findByPk(challenge_id);
      if (!challenge) {
        return res.status(404).json({ message: 'Challenge not found' });
      }

      // Create the poll
      const pollData = {
        title,
        description,
        options,
        challenge_id,
        user_id: req.user.user_id,
        question
      };

      console.log('Creating poll with data:', pollData);
      const poll = await Poll.create(pollData);
      console.log('Poll created successfully:', poll.toJSON());

      res.status(201).json({
        message: 'Poll created successfully',
        poll
      });
    } catch (createError) {
      console.error('Error during Poll.create:', createError);
      console.error('Error name:', createError.name);
      console.error('Error message:', createError.message);
      console.error('Error stack:', createError.stack);
      
      // Handle specific Sequelize errors
      if (createError.name === 'SequelizeValidationError') {
        return res.status(400).json({
          message: 'Validation error',
          errors: createError.errors.map(e => ({
            field: e.path,
            message: e.message
          }))
        });
      }
      
      if (createError.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
          message: 'Invalid reference: The challenge or user does not exist'
        });
      }

      throw createError;
    }
  } catch (error) {
    console.error('Create poll error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Error creating poll',
      error: error.message,
      name: error.name
    });
  }
};

exports.updatePoll = async (req, res) => {
  try {
    const { title, description, options } = req.body;
    const poll = await Poll.findByPk(req.params.id);
    
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    // Check if user owns this poll
    if (poll.user_id !== req.user.user_id) {
      return res.status(403).json({ message: 'You can only update your own polls' });
    }

    await poll.update({
      title: title || poll.title,
      description: description || poll.description,
      options: options || poll.options
    });

    res.json({
      message: 'Poll updated successfully',
      poll
    });
  } catch (error) {
    console.error('Update poll error:', error);
    res.status(500).json({ message: 'Error updating poll' });
  }
};

exports.deletePoll = async (req, res) => {
  try {
    const poll = await Poll.findByPk(req.params.id);
    
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    // Check if user owns this poll
    if (poll.user_id !== req.user.user_id) {
      return res.status(403).json({ message: 'You can only delete your own polls' });
    }

    await poll.destroy();
    res.json({ message: 'Poll deleted successfully' });
  } catch (error) {
    console.error('Delete poll error:', error);
    res.status(500).json({ message: 'Error deleting poll' });
  }
};

exports.addPollOption = async (req, res) => {
  try {
    const { text } = req.body;
    const poll = await Poll.findByPk(req.params.id);
    
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    // Check if user owns this poll
    if (poll.user_id !== req.userId) {
      return res.status(403).json({ message: 'You can only add options to your own polls' });
    }

    const option = await PollOption.create({
      poll_id: poll.id,
      text
    });

    res.status(201).json(option);
  } catch (error) {
    console.error('Add poll option error:', error);
    res.status(500).json({ message: 'Error adding poll option' });
  }
};

exports.deletePollOption = async (req, res) => {
  try {
    const { id, optionId } = req.params;
    const poll = await Poll.findByPk(id);
    
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    // Check if user owns this poll
    if (poll.user_id !== req.userId) {
      return res.status(403).json({ message: 'You can only delete options from your own polls' });
    }

    const option = await PollOption.findOne({
      where: { id: optionId, poll_id: id }
    });
    
    if (!option) {
      return res.status(404).json({ message: 'Poll option not found' });
    }

    await option.destroy();
    res.json({ message: 'Poll option deleted successfully' });
  } catch (error) {
    console.error('Delete poll option error:', error);
    res.status(500).json({ message: 'Error deleting poll option' });
  }
}; 