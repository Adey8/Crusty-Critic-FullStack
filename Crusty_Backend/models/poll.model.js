const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Poll extends Model {
    static associate(models) {
      Poll.belongsTo(models.Challenge, {
        foreignKey: 'challenge_id',
        as: 'challenge'
      });

      Poll.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      Poll.hasMany(models.Vote, {
        foreignKey: 'poll_id',
        as: 'votes'
      });

      Poll.hasMany(models.PollOption, {
        foreignKey: 'poll_id',
        as: 'pollOptions'
      });

      Poll.hasMany(models.Comment, {
        foreignKey: 'poll_id',
        as: 'comments'
      });
    }
  }

  Poll.init({
    poll_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    challenge_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'challenges',
        key: 'challenge_id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    question: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    options: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Poll',
    tableName: 'polls',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: (poll) => {
        console.log('Creating poll:', poll.toJSON());
      },
      afterCreate: (poll) => {
        console.log('Created poll:', poll.toJSON());
      }
    }
  });

  Poll.prototype.toJSON = function() {
    const values = { ...this.get() };
    return values;
  };

  return Poll;
}; 