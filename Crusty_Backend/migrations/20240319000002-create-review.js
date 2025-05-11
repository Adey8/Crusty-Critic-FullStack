'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reviews', {
      review_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        }
      },
      pizza_place_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'pizza_places',
          key: 'pizza_place_id'
        }
      },
      pizzeria_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      review_text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      date_submitted: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      approval_status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('reviews');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_reviews_approval_status";');
  }
}; 