const db = require('../models');
const { validationResult } = require('express-validator');

// Cast a vote
exports.castVote = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request headers:', req.headers);
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { poll_id, option_id } = req.body;
        
        // Validate required fields
        if (!poll_id || !option_id) {
            return res.status(400).json({ 
                message: "Missing required fields",
                required: {
                    poll_id: "Poll ID is required",
                    option_id: "Option ID is required"
                },
                received: {
                    poll_id,
                    option_id
                }
            });
        }

        const user_id = req.user.user_id; // From JWT token

        console.log('Vote request:', { poll_id, option_id, user_id });

        // Check if poll exists
        const poll = await db.Poll.findByPk(poll_id);
        if (!poll) {
            return res.status(404).json({ 
                message: "Poll not found",
                poll_id: poll_id
            });
        }

        // Check if option exists and belongs to the poll
        const option = await db.PollOption.findOne({
            where: { 
                id: option_id, 
                poll_id: poll_id 
            }
        });

        if (!option) {
            return res.status(404).json({ 
                message: "Invalid poll option",
                poll_id: poll_id,
                option_id: option_id
            });
        }

        // Check if user has already voted in this poll
        const existingVote = await db.Vote.findOne({
            where: { user_id, poll_id }
        });

        if (existingVote) {
            return res.status(400).json({ 
                message: "You have already voted in this poll",
                poll_id: poll_id
            });
        }

        // Create the vote
        const vote = await db.Vote.create({
            user_id,
            poll_id,
            option_id
        });

        res.status(201).json({
            message: "Vote cast successfully",
            vote
        });
    } catch (error) {
        console.error('Error casting vote:', error);
        res.status(500).json({ 
            message: "Error casting vote",
            error: error.message 
        });
    }
};

// Get user's votes
exports.getUserVotes = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const votes = await db.Vote.findAll({
            where: { user_id },
            include: [
                {
                    model: db.Poll,
                    as: 'poll',
                    attributes: ['title', 'description']
                },
                {
                    model: db.PollOption,
                    as: 'option',
                    attributes: ['text']
                }
            ]
        });
        res.json(votes);
    } catch (error) {
        console.error('Error getting user votes:', error);
        res.status(500).json({ 
            message: "Error getting user votes",
            error: error.message 
        });
    }
};

// Get votes for a specific poll
exports.getPollVotes = async (req, res) => {
    try {
        const { poll_id } = req.params;
        const votes = await db.Vote.findAll({
            where: { poll_id },
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['username']
                },
                {
                    model: db.PollOption,
                    as: 'option',
                    attributes: ['text']
                }
            ]
        });
        res.json(votes);
    } catch (error) {
        console.error('Error getting poll votes:', error);
        res.status(500).json({ 
            message: "Error getting poll votes",
            error: error.message 
        });
    }
};

// Delete a vote (admin only)
exports.deleteVote = async (req, res) => {
    try {
        const { id } = req.params;
        const vote = await db.Vote.findByPk(id);
        
        if (!vote) {
            return res.status(404).json({ message: "Vote not found" });
        }

        await vote.destroy();
        res.json({ message: "Vote deleted successfully" });
    } catch (error) {
        console.error('Error deleting vote:', error);
        res.status(500).json({ 
            message: "Error deleting vote",
            error: error.message 
        });
    }
}; 