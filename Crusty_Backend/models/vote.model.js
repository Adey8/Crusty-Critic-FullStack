const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Vote extends Model {
    static associate(models) {
      Vote.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      Vote.belongsTo(models.Poll, {
        foreignKey: 'poll_id',
        as: 'poll'
      });

      Vote.belongsTo(models.PollOption, {
        foreignKey: 'option_id',
        as: 'option'
      });
    }
  }

  Vote.init({
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    poll_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'polls',
        key: 'poll_id'
      }
    },
    option_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'poll_options',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Vote',
    tableName: 'votes',
    timestamps: true,
    underscored: true
  });

  return Vote;
};