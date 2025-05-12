const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class PizzaPlace extends Model {}

PizzaPlace.init({
  pizza_place_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  website_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location_lat: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: true
  },
  location_lng: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  average_rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'PizzaPlace',
  tableName: 'pizza_places',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = PizzaPlace;