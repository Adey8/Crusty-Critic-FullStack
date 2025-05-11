'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, drop the foreign key constraint if it exists
    try {
      await queryInterface.removeConstraint('reviews', 'reviews_pizza_place_id_fkey');
    } catch (error) {
      // Ignore error if constraint doesn't exist
    }
    
    // Then remove the column
    await queryInterface.removeColumn('reviews', 'pizza_place_id');
  },

  down: async (queryInterface, Sequelize) => {
    // Add the column back
    await queryInterface.addColumn('reviews', 'pizza_place_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'pizza_places',
        key: 'pizza_place_id'
      }
    });
  }
}; 