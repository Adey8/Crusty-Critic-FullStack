'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create challenges table
    await queryInterface.createTable('challenges', {
      challenge_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      challenge_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create polls table
    await queryInterface.createTable('polls', {
      poll_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      challenge_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'challenges',
          key: 'challenge_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      options: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: []
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create participate table for challenge participants
    await queryInterface.createTable('participates', {
      participate_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      challenge_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'challenges',
          key: 'challenge_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed'),
        allowNull: false,
        defaultValue: 'pending'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop tables in reverse order
    await queryInterface.dropTable('participates');
    await queryInterface.dropTable('polls');
    await queryInterface.dropTable('challenges');
  }
}; 