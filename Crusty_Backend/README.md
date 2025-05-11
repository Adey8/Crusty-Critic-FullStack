# Crusty Critic - Pizza Review Platform

A web application for discovering, reviewing, and rating pizza places.

## Environment Setup

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/crusty-critic.git
cd crusty-critic
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with your configuration:
     - Database credentials
     - JWT secret (generate a secure random string)
     - Google Maps API key (for geocoding)
     - SMTP settings (if using email features)

### Environment Variables

#### Required Variables:
- `DB_HOST`: Database host (default: localhost)
- `DB_PORT`: Database port (default: 5432)
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: Secret key for JWT token generation

#### Optional Variables:
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/test/production)
- `GOOGLE_MAPS_API_KEY`: For geocoding functionality
- `CORS_ORIGIN`: CORS allowed origin
- `RATE_LIMIT_WINDOW`: Rate limiting window
- `RATE_LIMIT_MAX_REQUESTS`: Maximum requests per window
- `MAX_FILE_SIZE`: Maximum file upload size
- `ALLOWED_FILE_TYPES`: Allowed file upload types
- Email configuration (for future use):
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASSWORD`
  - `EMAIL_FROM`

### Database Setup

1. Create the database:
```bash
createdb crusty_critic
```

2. Run migrations:
```bash
npm run db:migrate
```

3. (Optional) Seed the database:
```bash
npm run db:seed
```

### Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

### Testing

Run tests:
```bash
npm test
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/login`: User login
- `POST /api/auth/register`: User registration
- `GET /api/auth/profile`: Get user profile
- `PUT /api/auth/profile`: Update user profile

### Pizza Place Endpoints
- `GET /api/pizzaplaces/search`: Search pizza places
- `GET /api/pizzaplaces/nearby`: Get nearby pizza places
- `GET /api/pizzaplaces/:id`: Get pizza place details

### Review Endpoints
- `POST /api/reviews`: Create review
- `GET /api/reviews/pizzaplace/:pizzaPlaceId`: Get pizza place reviews
- `PUT /api/reviews/:reviewId`: Update review
- `DELETE /api/reviews/:reviewId`: Delete review

### Deal Endpoints
- `GET /api/deals/active`: Get active deals
- `GET /api/deals/pizzaplace/:pizzaPlaceId`: Get pizza place deals

### Map Endpoints
- `GET /api/map/all`: Get all locations
- `GET /api/map/bounds`: Get locations within bounds
- `GET /api/map/nearby`: Get nearby locations
- `GET /api/map/deals`: Get locations with active deals

### Admin Endpoints
- `GET /api/admin/users`: Get all users
- `PUT /api/admin/users/:userId`: Update user
- `DELETE /api/admin/users/:userId`: Delete user
- `GET /api/admin/reviews/pending`: Get pending reviews
- `PUT /api/admin/reviews/:reviewId/moderate`: Moderate review

## Security Considerations

1. JWT tokens are used for authentication
2. Passwords are hashed using bcrypt
3. Input validation is implemented
4. Rate limiting is configured
5. CORS is properly configured
6. SQL injection prevention through Sequelize
7. File upload restrictions
8. Admin routes are protected

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
