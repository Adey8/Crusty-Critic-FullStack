const { Review, User, PizzaPlace } = require('../models');

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { pizzeria_name, rating, review_text } = req.body;
    
    // Validate input
    if (!pizzeria_name || !rating || rating < 1 || rating > 5 || !review_text) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    // Check if pizza place exists
    const pizzaPlace = await PizzaPlace.findOne({ where: { name: pizzeria_name } });
    if (!pizzaPlace) {
      return res.status(404).json({ message: 'Pizza place not found' });
    }

    const review = await Review.create({
      user_id: req.userId,
      pizzeria_name,
      rating,
      review_text,
      date_submitted: new Date(),
      approval_status: 'Pending'
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Create review error:', error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'Invalid pizza place or user ID' });
    }
    res.status(500).json({ message: 'Error creating review' });
  }
};

// Get reviews by pizza place name
exports.getReviewsByPizzaPlace = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { pizzeria_name: req.params.pizzaPlaceName },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username', 'profile_picture_url']
        }
      ]
    });
    res.json(reviews);
  } catch (error) {
    console.error('Get reviews by pizza place error:', error);
    res.status(500).json({ message: 'Error getting reviews' });
  }
};

// Get reviews by user ID
exports.getReviewsByUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const reviews = await Review.findAll({
      where: { user_id: userId },
      include: [
        {
          model: PizzaPlace,
          as: 'pizzaPlace',
          attributes: ['name', 'address']
        }
      ],
      order: [['date_submitted', 'DESC']]
    });
    
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Error fetching user reviews' });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { rating, review_text } = req.body;
    const review = await Review.findByPk(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.user_id !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    await review.update({
      rating: rating || review.rating,
      review_text: review_text || review.review_text
    });

    res.json(review);
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Error updating review' });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.user_id !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.destroy();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Error deleting review' });
  }
};

// Calculate average rating for a pizza place
exports.calculateAverageRating = async (req, res) => {
  try {
    const { pizzaPlaceName } = req.params;
    
    const result = await Review.findAll({
      where: { 
        pizzeria_name: pizzaPlaceName,
        approval_status: 'Approved'
      },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'average_rating']
      ]
    });
    
    const averageRating = result[0].getDataValue('average_rating');
    
    // Update the pizza place's average rating
    await PizzaPlace.update(
      { average_rating: averageRating },
      { where: { name: pizzaPlaceName } }
    );
    
    res.status(200).json({ average_rating: averageRating });
  } catch (error) {
    console.error('Error calculating average rating:', error);
    res.status(500).json({ message: 'Error calculating average rating' });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username', 'profile_picture_url']
        },
        {
          model: PizzaPlace,
          as: 'pizzaPlace',
          attributes: ['name', 'address']
        }
      ],
      attributes: [
        'review_id',
        'user_id',
        'pizzeria_name',
        'rating',
        'review_text',
        'date_submitted',
        'approval_status'
      ]
    });
    res.json(reviews);
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({ message: 'Error getting reviews' });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username', 'profile_picture_url']
        },
        {
          model: PizzaPlace,
          as: 'pizzaPlace',
          attributes: ['name', 'address']
        }
      ]
    });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    console.error('Get review by ID error:', error);
    res.status(500).json({ message: 'Error getting review' });
  }
};