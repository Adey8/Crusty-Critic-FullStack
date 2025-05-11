const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class MapCoordinate extends Model {
    static associate(models) {
      MapCoordinate.belongsTo(models.PizzaPlace, {
        foreignKey: 'pizza_place_id',
        as: 'pizzaPlace'
      });
    }
  }

  MapCoordinate.init({
    pizza_place_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'pizza_places',
        key: 'pizza_place_id'
      }
    },
    latitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'MapCoordinate',
    tableName: 'map_coordinates',
    timestamps: true
  });

  return MapCoordinate;
};