'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('polls');
    if (!tableInfo.created_at) {
      await queryInterface.addColumn('polls', 'created_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      });
    }
    if (!tableInfo.updated_at) {
      await queryInterface.addColumn('polls', 'updated_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('polls');
    if (tableInfo.created_at) {
      await queryInterface.removeColumn('polls', 'created_at');
    }
    if (tableInfo.updated_at) {
      await queryInterface.removeColumn('polls', 'updated_at');
    }
  },
};