const db = require('../models');
const UserDietaryNeeds = db.UserDietaryNeeds;
const DietaryNeeds = db.DietaryNeeds;
const { validationResult } = require('express-validator');

// Add dietary needs for a user
exports.addUserDietaryNeeds = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.userId; // From JWT token
        const { needIds } = req.body; // Array of dietary need IDs

        // Validate if all dietary needs exist
        const existingNeeds = await DietaryNeeds.findAll({
            where: { need_id: needIds }
        });

        if (existingNeeds.length !== needIds.length) {
            return res.status(400).send({ message: "One or more dietary needs are invalid" });
        }

        // Delete existing dietary needs for the user
        await UserDietaryNeeds.destroy({
            where: { user_id: userId }
        });

        // Create new dietary needs entries
        const userDietaryNeeds = needIds.map(need_id => ({
            user_id: userId,
            need_id
        }));

        await UserDietaryNeeds.bulkCreate(userDietaryNeeds);

        res.status(201).json({
            message: "Dietary needs updated successfully"
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Get user's dietary needs
exports.getUserDietaryNeeds = async (req, res) => {
    try {
        const userId = req.params.userId || req.userId;
        
        const dietaryNeeds = await UserDietaryNeeds.findAll({
            where: { user_id: userId },
            include: [{
                model: db.DietaryNeeds,
                attributes: ['name', 'description']
            }]
        });

        res.json(dietaryNeeds);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Delete a specific dietary need for a user
exports.deleteUserDietaryNeed = async (req, res) => {
    try {
        const userId = req.userId;
        const { needId } = req.params;

        const deleted = await UserDietaryNeeds.destroy({
            where: {
                user_id: userId,
                need_id: needId
            }
        });

        if (!deleted) {
            return res.status(404).send({ message: "Dietary need not found for this user" });
        }

        res.send({ message: "Dietary need removed successfully" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Get all users with specific dietary need (admin only)
exports.getUsersByDietaryNeed = async (req, res) => {
    try {
        const { needId } = req.params;

        const users = await UserDietaryNeeds.findAll({
            where: { need_id: needId },
            include: [{
                model: db.User,
                attributes: ['username', 'email']
            }]
        });

        res.json(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}; 