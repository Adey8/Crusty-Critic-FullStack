const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Participate extends Model {
    static associate(models) {
      Participate.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      Participate.belongsTo(models.Challenge, {
        foreignKey: 'challenge_id',
        as: 'challenge'
      });
    }
  }

  Participate.init({
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    challenge_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'challenges',
        key: 'challenge_id'
      }
    }
  }, {
    sequelize,
    modelName: 'Participate',
    tableName: 'participate',
    timestamps: true
  });

  return Participate;
};