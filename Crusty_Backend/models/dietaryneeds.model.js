const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class DietaryNeeds extends Model {
    static associate(models) {
      DietaryNeeds.hasMany(models.UserDietaryNeeds, {
        foreignKey: 'need_id',
        as: 'userDietaryNeeds'
      });
    }
  }

  DietaryNeeds.init({
    need_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'DietaryNeeds',
    tableName: 'dietary_needs',
    timestamps: true
  });

  return DietaryNeeds;
};