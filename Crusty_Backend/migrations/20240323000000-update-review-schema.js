'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop the table and recreate it with the new schema
    await queryInterface.dropTable('reviews');

    // Ensure the enum type exists and includes the required values
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'enum_reviews_approval_status'
        ) THEN
          CREATE TYPE enum_reviews_approval_status AS ENUM ('Approved', 'Rejected');
        END IF;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        BEGIN
          ALTER TYPE enum_reviews_approval_status ADD VALUE 'Pending';
        EXCEPTION
          WHEN duplicate_object THEN NULL;
        END;
      END $$;
    `);

    // Recreate the reviews table with the updated schema
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
      pizzeria_name: {
        type: Sequelize.STRING,
        allowNull: false
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
        defaultValue: Sequelize.NOW
      },
      approval_status: {
        type: Sequelize.ENUM('Pending', 'Approved', 'Rejected'),
        allowNull: false,
        defaultValue: 'Pending'
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
    await queryInterface.dropTable('reviews');
  }
};