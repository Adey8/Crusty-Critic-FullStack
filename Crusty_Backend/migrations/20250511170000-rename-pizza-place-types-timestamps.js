'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('pizza_place_types');
    if (tableInfo.created_at && !tableInfo.createdAt) {
      await queryInterface.renameColumn('pizza_place_types', 'created_at', 'createdAt');
    }
    if (tableInfo.updated_at && !tableInfo.updatedAt) {
      await queryInterface.renameColumn('pizza_place_types', 'updated_at', 'updatedAt');
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('pizza_place_types');
    if (tableInfo.createdAt && !tableInfo.created_at) {
      await queryInterface.renameColumn('pizza_place_types', 'createdAt', 'created_at');
    }
    if (tableInfo.updatedAt && !tableInfo.updated_at) {
      await queryInterface.renameColumn('pizza_place_types', 'updatedAt', 'updated_at');
    }
  }
};
