'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('polls');
    if (!tableInfo.options) {
      await queryInterface.addColumn('polls', 'options', {
        type: Sequelize.JSON,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('polls', 'options');
  },
};