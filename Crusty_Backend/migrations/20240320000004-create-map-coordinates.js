'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('map_coordinates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pizza_place_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pizza_places',
          key: 'pizza_place_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: false
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('Restaurant', 'Delivery', 'Both'),
        allowNull: false,
        defaultValue: 'Restaurant'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('map_coordinates');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_map_coordinates_type";');
  }
}; 