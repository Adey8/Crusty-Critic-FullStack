'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('polls');
    if (!tableInfo.user_id) {
      await queryInterface.addColumn('polls', 'user_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onDelete: 'CASCADE',
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('polls');
    if (tableInfo.user_id) {
      await queryInterface.removeColumn('polls', 'user_id');
    }
  },
};