'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('polls', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      after: 'challenge_id'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('polls', 'user_id');
  }
}; 