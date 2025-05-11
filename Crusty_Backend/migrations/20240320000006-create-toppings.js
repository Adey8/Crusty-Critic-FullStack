'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the toppings table
    await queryInterface.createTable('toppings', {
      topping_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      type: {
        type: Sequelize.ENUM('meat', 'vegetable', 'cheese', 'sauce', 'other'),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
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

    // Create the pizza_place_toppings junction table
    await queryInterface.createTable('pizza_place_toppings', {
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
      topping_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'toppings',
          key: 'topping_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('pizza_place_toppings');
    await queryInterface.dropTable('toppings');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_toppings_type";');
  }
}; 