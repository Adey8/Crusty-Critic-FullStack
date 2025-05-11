'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('polls');
    if (!tableInfo.challenge_id) {
      await queryInterface.addColumn('polls', 'challenge_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'challenges',
          key: 'challenge_id',
        },
        onDelete: 'CASCADE',
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('polls', 'challenge_id');
  },
};