const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PizzaPlaceType extends Model {
    static associate(models) {
      PizzaPlaceType.belongsTo(models.PizzaPlace, {
        foreignKey: 'pizza_place_id',
        as: 'pizzaPlace'
      });
      PizzaPlaceType.belongsTo(models.PizzaType, {
        foreignKey: 'type_id',
        as: 'pizzaType'
      });
    }
  }

  PizzaPlaceType.init({
    pizza_place_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'pizza_places',
        key: 'pizza_place_id'
      }
    },
    type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'pizza_types',
        key: 'type_id'
      }
    }
  }, {
    sequelize,
    modelName: 'PizzaPlaceType',
    tableName: 'pizza_place_types',
    timestamps: true // Do NOT add underscored: true
  });

  return PizzaPlaceType;
};