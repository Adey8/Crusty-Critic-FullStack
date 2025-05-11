// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const auth = require('./middleware/auth');
const db = require('./models');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const reviewRoutes = require('./routes/reviews.routes');
const pizzaPlaceRoutes = require('./routes/pizzaplaces.routes');
const dealsRoutes = require('./routes/deals.routes');
const mapCoordinatesRoutes = require('./routes/mapcoordinates.routes');
const toppingsRoutes = require('./routes/toppings.routes');
const dietaryNeedsRoutes = require('./routes/dietaryneeds.routes');
const votesRoutes = require('./routes/votes.routes');
const pollsRoutes = require('./routes/polls.routes');
const pizzaPlaceTypeRoutes = require('./routes/pizzaplacetype.routes');
const pizzaTypeRoutes = require('./routes/pizzatype.routes');
const pizzaPlaceToppingsRoutes = require('./routes/pizzaplacetoppings.routes');
const participateRoutes = require('./routes/participate.routes');
const challengesRoutes = require('./routes/challenges.routes');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes (require authentication)
app.use('/api/users', auth, userRoutes);
app.use('/api/admin', auth, adminRoutes);
app.use('/api/reviews', auth, reviewRoutes);
app.use('/api/pizzaplaces', auth, pizzaPlaceRoutes);
app.use('/api/deals', auth, dealsRoutes);
app.use('/api/map', auth, mapCoordinatesRoutes);
app.use('/api/toppings', auth, toppingsRoutes);
app.use('/api/dietary-needs', auth, dietaryNeedsRoutes);
app.use('/api/votes', auth, votesRoutes);
app.use('/api/polls', auth, pollsRoutes);
app.use('/api/pizza-place-types', auth, pizzaPlaceTypeRoutes);
app.use('/api/pizza-types', auth, pizzaTypeRoutes);
app.use('/api/pizza-place-toppings', auth, pizzaPlaceToppingsRoutes);
app.use('/api/participate', auth, participateRoutes);
app.use('/api/challenges', auth, challengesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    stack: err.stack
  });
  
  // Handle Sequelize errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Handle other errors
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: err.message,
    name: err.name
  });
});

module.exports = app;
