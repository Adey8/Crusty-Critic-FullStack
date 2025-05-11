const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Deal extends Model {
    static associate(models) {
      Deal.belongsTo(models.PizzaPlace, {
        foreignKey: 'pizza_place_id',
        as: 'pizzaPlace'
      });
    }
  }

  Deal.init({
    deal_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    pizza_place_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pizza_places',
        key: 'pizza_place_id'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    expiration_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Deal',
    tableName: 'deals',
    timestamps: true
  });

  return Deal;
};