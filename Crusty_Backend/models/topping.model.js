const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Topping extends Model {
    static associate(models) {
      Topping.belongsToMany(models.PizzaPlace, {
        through: models.pizzaPlaceTopping, // Use the model, not a string
        foreignKey: 'topping_id',
        otherKey: 'pizza_place_id',
        as: 'pizzaPlaces',
        timestamps: true
      });
    }
  }

  Topping.init({
    topping_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('meat', 'vegetable', 'cheese', 'sauce', 'other'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Topping',
    tableName: 'toppings',
    timestamps: true
  });

  return Topping;
};