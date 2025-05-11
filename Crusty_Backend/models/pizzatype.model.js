const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PizzaType extends Model {
    static associate(models) {
      // Many-to-many with pizza places through pizza_place_types
      PizzaType.belongsToMany(models.PizzaPlace, {
        through: 'pizza_place_types',
        foreignKey: 'type_id',
        otherKey: 'pizza_place_id', // <-- Add this line
        as: 'pizzaPlaces'
      });
    }
  }

  PizzaType.init({
    type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    dough_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    crust_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'PizzaType',
    tableName: 'pizza_types',
    timestamps: true
  });

  return PizzaType;
};