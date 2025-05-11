'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pizza_types', {
      type_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      dough_type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      crust_type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create the junction table for pizza places and pizza types
    await queryInterface.createTable('pizza_place_types', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
      type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pizza_types',
          key: 'type_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pizza_place_types');
    await queryInterface.dropTable('pizza_types');
  }
};