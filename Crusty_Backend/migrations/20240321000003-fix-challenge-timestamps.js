'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get the table description to check existing columns
    const tableInfo = await queryInterface.describeTable('challenges');
    
    // If created_at exists, rename it to createdAt
    if (tableInfo.created_at) {
      await queryInterface.renameColumn('challenges', 'created_at', 'createdAt');
    } else if (!tableInfo.createdAt) {
      await queryInterface.addColumn('challenges', 'createdAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
    }

    // If updated_at exists, rename it to updatedAt
    if (tableInfo.updated_at) {
      await queryInterface.renameColumn('challenges', 'updated_at', 'updatedAt');
    } else if (!tableInfo.updatedAt) {
      await queryInterface.addColumn('challenges', 'updatedAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Get the table description to check existing columns
    const tableInfo = await queryInterface.describeTable('challenges');
    
    // If createdAt exists, rename it to created_at
    if (tableInfo.createdAt) {
      await queryInterface.renameColumn('challenges', 'createdAt', 'created_at');
    }

    // If updatedAt exists, rename it to updated_at
    if (tableInfo.updatedAt) {
      await queryInterface.renameColumn('challenges', 'updatedAt', 'updated_at');
    }
  }
}; 