const express = require('express');
const router = express.Router();
const mapCoordinateController = require('../controllers/mapcoordinates.controllers');
const auth = require('../middleware/auth');

// Public routes
router.get('/', mapCoordinateController.getAllCoordinates);
router.get('/:id', mapCoordinateController.getCoordinateById);
router.get('/pizza-place/:pizzaPlaceId', mapCoordinateController.getCoordinatesByPizzaPlace);

// Protected routes
router.post('/', auth, mapCoordinateController.createCoordinate);
router.put('/:id', auth, mapCoordinateController.updateCoordinate);
router.delete('/:id', auth, mapCoordinateController.deleteCoordinate);

module.exports = router; 