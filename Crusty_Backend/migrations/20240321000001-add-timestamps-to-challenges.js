'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('challenges');
    if (!tableInfo.created_at) {
      await queryInterface.addColumn('challenges', 'created_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      });
    }
    if (!tableInfo.updated_at) {
      await queryInterface.addColumn('challenges', 'updated_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('challenges', 'created_at');
    await queryInterface.removeColumn('challenges', 'updated_at');
  },
};