const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PizzaPlace extends Model {
    static associate(models) {
      // Has many reviews
      PizzaPlace.hasMany(models.Review, {
        foreignKey: 'pizzeria_name',
        targetKey: 'name',
        as: 'reviews'
      });
      
      // Has many deals
      PizzaPlace.hasMany(models.Deal, {
        foreignKey: 'pizza_place_id',
        as: 'deals'
      });
      
      // Has one map coordinate
      PizzaPlace.hasOne(models.MapCoordinate, {
        foreignKey: 'pizza_place_id',
        as: 'coordinates'
      });
      
      // Many-to-many with pizza types through pizza_place_types
      PizzaPlace.belongsToMany(models.PizzaType, {
        through: models.PizzaPlaceType,
        foreignKey: 'pizza_place_id',
        otherKey: 'type_id',
        as: 'pizzaTypes'
      });
      
      // Many-to-many with toppings through pizza_place_toppings
      PizzaPlace.belongsToMany(models.Topping, {
        through: models.pizzaPlaceTopping, // Use the model, not a string
        foreignKey: 'pizza_place_id',
        otherKey: 'topping_id',
        as: 'toppings',
        timestamps: true // Ensure timestamps are enabled
      });
    }
  }
  
  PizzaPlace.init({
    pizza_place_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    website_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    average_rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'PizzaPlace',
    tableName: 'pizza_places',
    timestamps: true,  // Enable createdAt and updatedAt
    underscored: true   // Use snake_case columns
  });
  

  return PizzaPlace;
};