const db = require('../models');
const Topping = db.Topping;
const { validationResult } = require('express-validator');

// Get all toppings
exports.getAllToppings = async (req, res) => {
    try {
        const toppings = await Topping.findAll();
        res.json(toppings);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Get topping by ID
exports.getToppingById = async (req, res) => {
    try {
        const topping = await Topping.findByPk(req.params.id);
        if (!topping) {
            return res.status(404).send({ message: "Topping not found" });
        }
        res.json(topping);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Get toppings by type
exports.getToppingsByType = async (req, res) => {
    try {
        const { type } = req.params;
        const validTypes = ['meat', 'vegetable', 'cheese', 'sauce', 'other'];
        
        if (!validTypes.includes(type)) {
            return res.status(400).send({ 
                message: "Invalid topping type. Must be one of: meat, vegetable, cheese, sauce, other" 
            });
        }

        const toppings = await Topping.findAll({
            where: { type }
        });
        res.json(toppings);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Get pizza places with a specific topping
exports.getPizzaPlacesWithTopping = async (req, res) => {
    try {
        const { id } = req.params;
        
        const topping = await Topping.findByPk(id, {
            include: [{
                model: db.pizzaplace,
                through: db.pizzaplacetopping,
                attributes: ['pizza_place_id', 'name', 'address', 'average_rating']
            }]
        });
        
        if (!topping) {
            return res.status(404).send({ message: "Topping not found" });
        }
        
        res.json(topping.pizzaplaces);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Create new topping (admin only)
exports.createTopping = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { name, description, price, type } = req.body;
        
        // Check if topping already exists
        const existingTopping = await Topping.findOne({ where: { name } });
        if (existingTopping) {
            return res.status(400).send({ message: "Topping with this name already exists" });
        }
        
        // Create topping
        const topping = await Topping.create({
            name,
            description,
            price,
            type
        });
        
        res.status(201).json(topping);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Update topping (admin only)
exports.updateTopping = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { id } = req.params;
        const { name, description, price, type } = req.body;
        
        // Find topping
        const topping = await Topping.findByPk(id);
        if (!topping) {
            return res.status(404).send({ message: "Topping not found" });
        }
        
        // Check if new name conflicts with existing topping
        if (name && name !== topping.name) {
            const existingTopping = await Topping.findOne({ where: { name } });
            if (existingTopping) {
                return res.status(400).send({ message: "Topping with this name already exists" });
            }
        }
        
        // Update topping
        await topping.update({
            name: name || topping.name,
            description: description || topping.description,
            price: price || topping.price,
            type: type || topping.type
        });
        
        res.json(topping);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Delete topping (admin only)
exports.deleteTopping = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find topping
        const topping = await Topping.findByPk(id);
        if (!topping) {
            return res.status(404).send({ message: "Topping not found" });
        }
        
        // Delete topping
        await topping.destroy();
        
        res.json({ message: "Topping deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}; 