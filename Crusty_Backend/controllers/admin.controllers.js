const db = require('../models');
const { sequelize } = db;
const { User, Review, Challenge, Poll, PizzaPlace, Vote, Comment } = db;

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Error getting users' });
  }
};

// Get user by ID (admin only)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Error getting user' });
  }
};

// Update user (admin only)
exports.updateUser = async (req, res) => {
  try {
    const { username, email, is_admin } = req.body;
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({
      username: username || user.username,
      email: email || user.email,
      is_admin: is_admin !== undefined ? is_admin : user.is_admin
    });

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Deactivate user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Manage reviews (admin only)
exports.getPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { approval_status: 'Pending' },
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: PizzaPlace,
          attributes: ['id', 'name']
        }
      ]
    });
    
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching pending reviews:', error);
    res.status(500).json({ message: 'Server error while fetching pending reviews' });
  }
};

// Approve or reject review
exports.moderateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { action, reason } = req.body;

    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (action === 'approve') {
      await review.update({ approval_status: 'Approved' });

      // Update pizza place rating
      const pizzaPlace = await PizzaPlace.findByPk(review.pizza_place_id);
      const approvedReviews = await Review.findAll({
        where: { 
          pizza_place_id: review.pizza_place_id,
          approval_status: 'Approved'
        },
        attributes: ['rating']
      });

      const totalRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = totalRating / approvedReviews.length;
      await pizzaPlace.update({ average_rating: avgRating });

    } else if (action === 'reject') {
      await review.update({
        approval_status: 'Rejected',
        rejection_reason: reason
      });
    }

    res.status(200).json({
      message: `Review ${action}ed successfully`,
      review
    });
  } catch (error) {
    console.error('Review moderation error:', error);
    res.status(500).json({ message: 'Server error while moderating review' });
  }
};

// Get moderation statistics
exports.getModerationStats = async (req, res) => {
  try {
    const stats = await Review.findAll({
      attributes: [
        'approval_status',
        [sequelize.fn('COUNT', sequelize.col('review_id')), 'count']
      ],
      group: ['approval_status']
    });

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching moderation stats:', error);
    res.status(500).json({ message: 'Server error while fetching moderation stats' });
  }
};

// Create challenge (admin only)
exports.createChallenge = async (req, res) => {
  try {
    const { challengeName, description, startDate, endDate } = req.body;
    
    // Validate input
    if (!challengeName || !description || !startDate || !endDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Create challenge
    const newChallenge = await Challenge.create({
      challenge_name: challengeName,
      description,
      start_date: new Date(startDate),
      end_date: new Date(endDate)
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

// Create poll for challenge (admin only)
exports.createPoll = async (req, res) => {
  try {
    const { challengeId, options } = req.body;
    
    // Validate input
    if (!challengeId || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: 'Challenge ID and at least two options are required' });
    }
    
    // Check if challenge exists
    const challenge = await Challenge.findByPk(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    // Create poll
    const newPoll = await Poll.create({
      challenge_id: challengeId,
      challenge_name: challenge.challenge_name,
      options: JSON.stringify(options),
      date_created: new Date()
    });
    
    res.status(201).json({
      message: 'Poll created successfully',
      poll: newPoll
    });
  } catch (error) {
    console.error('Poll creation error:', error);
    res.status(500).json({ message: 'Server error while creating poll' });
  }
};

// Pizza place management
exports.createPizzaPlace = async (req, res) => {
  try {
    const { name, address, description, ownerId } = req.body;
    
    if (!name || !address) {
      return res.status(400).json({ message: 'Name and address are required' });
    }
    
    const pizzaPlace = await PizzaPlace.create({
      name,
      address,
      description,
      owner_id: ownerId
    });
    
    res.status(201).json({
      message: 'Pizza place created successfully',
      pizzaPlace
    });
  } catch (error) {
    console.error('Pizza place creation error:', error);
    res.status(500).json({ message: 'Server error while creating pizza place' });
  }
};

exports.updatePizzaPlace = async (req, res) => {
  try {
    const { pizzaPlaceId } = req.params;
    const { name, address, description, ownerId } = req.body;
    
    const pizzaPlace = await PizzaPlace.findByPk(pizzaPlaceId);
    if (!pizzaPlace) {
      return res.status(404).json({ message: 'Pizza place not found' });
    }
    
    await pizzaPlace.update({
      name: name || pizzaPlace.name,
      address: address || pizzaPlace.address,
      description: description || pizzaPlace.description,
      owner_id: ownerId || pizzaPlace.owner_id
    });
    
    res.status(200).json({
      message: 'Pizza place updated successfully',
      pizzaPlace
    });
  } catch (error) {
    console.error('Pizza place update error:', error);
    res.status(500).json({ message: 'Server error while updating pizza place' });
  }
};

exports.deletePizzaPlace = async (req, res) => {
  try {
    const { pizzaPlaceId } = req.params;
    
    const pizzaPlace = await PizzaPlace.findByPk(pizzaPlaceId);
    if (!pizzaPlace) {
      return res.status(404).json({ message: 'Pizza place not found' });
    }
    
    await pizzaPlace.destroy();
    
    res.status(200).json({ message: 'Pizza place deleted successfully' });
  } catch (error) {
    console.error('Pizza place deletion error:', error);
    res.status(500).json({ message: 'Server error while deleting pizza place' });
  }
};

// Topping management
exports.createTopping = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }
    
    const topping = await db.Topping.create({
      name,
      description,
      price
    });
    
    res.status(201).json({
      message: 'Topping created successfully',
      topping
    });
  } catch (error) {
    console.error('Topping creation error:', error);
    res.status(500).json({ message: 'Server error while creating topping' });
  }
};

exports.updateTopping = async (req, res) => {
  try {
    const { toppingId } = req.params;
    const { name, description, price } = req.body;
    
    const topping = await db.Topping.findByPk(toppingId);
    if (!topping) {
      return res.status(404).json({ message: 'Topping not found' });
    }
    
    await topping.update({
      name: name || topping.name,
      description: description || topping.description,
      price: price || topping.price
    });
    
    res.status(200).json({
      message: 'Topping updated successfully',
      topping
    });
  } catch (error) {
    console.error('Topping update error:', error);
    res.status(500).json({ message: 'Server error while updating topping' });
  }
};

exports.deleteTopping = async (req, res) => {
  try {
    const { toppingId } = req.params;
    
    const topping = await db.Topping.findByPk(toppingId);
    if (!topping) {
      return res.status(404).json({ message: 'Topping not found' });
    }
    
    await topping.destroy();
    
    res.status(200).json({ message: 'Topping deleted successfully' });
  } catch (error) {
    console.error('Topping deletion error:', error);
    res.status(500).json({ message: 'Server error while deleting topping' });
  }
};

// Poll management
exports.getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.findAll();
    res.json(polls);
  } catch (error) {
    console.error('Get all polls error:', error);
    res.status(500).json({ message: 'Error getting polls' });
  }
};

exports.getPollById = async (req, res) => {
  try {
    const poll = await Poll.findByPk(req.params.id);
    
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    res.json(poll);
  } catch (error) {
    console.error('Get poll by ID error:', error);
    res.status(500).json({ message: 'Error getting poll' });
  }
};

exports.deletePoll = async (req, res) => {
  try {
    const poll = await Poll.findByPk(req.params.id);
    
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    await poll.destroy();
    res.json({ message: 'Poll deleted successfully' });
  } catch (error) {
    console.error('Delete poll error:', error);
    res.status(500).json({ message: 'Error deleting poll' });
  }
};

// Vote management
exports.getAllVotes = async (req, res) => {
  try {
    const votes = await Vote.findAll();
    res.json(votes);
  } catch (error) {
    console.error('Get all votes error:', error);
    res.status(500).json({ message: 'Error getting votes' });
  }
};

exports.getVoteById = async (req, res) => {
  try {
    const vote = await Vote.findByPk(req.params.id);
    
    if (!vote) {
      return res.status(404).json({ message: 'Vote not found' });
    }

    res.json(vote);
  } catch (error) {
    console.error('Get vote by ID error:', error);
    res.status(500).json({ message: 'Error getting vote' });
  }
};

exports.deleteVote = async (req, res) => {
  try {
    const vote = await Vote.findByPk(req.params.id);
    
    if (!vote) {
      return res.status(404).json({ message: 'Vote not found' });
    }

    await vote.destroy();
    res.json({ message: 'Vote deleted successfully' });
  } catch (error) {
    console.error('Delete vote error:', error);
    res.status(500).json({ message: 'Error deleting vote' });
  }
};

// Comment management
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.findAll();
    res.json(comments);
  } catch (error) {
    console.error('Get all comments error:', error);
    res.status(500).json({ message: 'Error getting comments' });
  }
};

exports.getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json(comment);
  } catch (error) {
    console.error('Get comment by ID error:', error);
    res.status(500).json({ message: 'Error getting comment' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await comment.destroy();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Error deleting comment' });
  }
};