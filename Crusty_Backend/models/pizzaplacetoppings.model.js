const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PizzaPlaceToppings extends Model {
    static associate(models) {
      PizzaPlaceToppings.belongsTo(models.PizzaPlace, {
        foreignKey: 'pizza_place_id',
        as: 'pizzaPlace'
      });
      PizzaPlaceToppings.belongsTo(models.Topping, {
        foreignKey: 'topping_id',
        as: 'topping'
      });
    }
  }

  PizzaPlaceToppings.init({
    pizza_place_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'pizza_places',
        key: 'pizza_place_id'
      }
    },
    topping_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'toppings',
        key: 'topping_id'
      }
    }
  }, {
    sequelize,
    modelName: 'PizzaPlaceToppings',
    tableName: 'pizza_place_toppings',
    timestamps: true
  });

  return PizzaPlaceToppings;
};