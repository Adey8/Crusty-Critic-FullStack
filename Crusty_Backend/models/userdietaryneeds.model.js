const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class UserDietaryNeeds extends Model {
    static associate(models) {
      UserDietaryNeeds.belongsTo(models.DietaryNeeds, {
        foreignKey: 'need_id',
        as: 'dietaryNeed'
      });
      UserDietaryNeeds.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }

  UserDietaryNeeds.init({
    need_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dietary_needs',
        key: 'need_id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    }
  }, {
    sequelize,
    modelName: 'UserDietaryNeeds',
    tableName: 'user_dietary_needs',
    timestamps: true
  });

  return UserDietaryNeeds;
};