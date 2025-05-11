const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class pizzaPlaceTopping extends Model {}

  pizzaPlaceTopping.init({
    pizza_place_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    topping_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'pizzaPlaceTopping',
    tableName: 'pizza_place_toppings',
    timestamps: true // Use camelCase: createdAt, updatedAt
  });

  return pizzaPlaceTopping;
};