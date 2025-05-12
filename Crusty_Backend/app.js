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

// Error handler for invalid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  next();
});

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

//a test route to check if the server is running
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Server is running!' });
});

// Health check route for DB connectivity
app.get('/api/health', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.status(200).json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'disconnected', error: err.message });
  }
});

// Sync database and create tables if they don't exist
db.sequelize.sync({ force: false })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

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
