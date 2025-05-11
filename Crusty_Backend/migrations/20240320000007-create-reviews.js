'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First create the enum type if it doesn't exist
    await queryInterface.sequelize.query(`DO $$ BEGIN
      CREATE TYPE enum_reviews_approval_status AS ENUM ('Pending', 'Approved', 'Rejected');
      EXCEPTION WHEN duplicate_object THEN null;
    END $$;`);

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
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
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
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
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
        type: Sequelize.ENUM('Pending', 'Approved', 'Rejected'),
        defaultValue: 'Pending',
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

    // Add indexes for better query performance
    await queryInterface.addIndex('reviews', ['user_id']);
    await queryInterface.addIndex('reviews', ['pizza_place_id']);
    await queryInterface.addIndex('reviews', ['rating']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('reviews');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_reviews_approval_status;');
  }
}; 